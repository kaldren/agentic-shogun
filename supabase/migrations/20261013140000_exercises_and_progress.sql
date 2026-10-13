-- Exercises: ordered per lesson. `type` picks the exercise kind, `content`
-- is what the learner sees, `solution` is never readable by users.
create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  lesson_id text not null references public.lessons (id) on delete cascade,
  position integer not null,
  type text not null check (type in ('multiple_choice')),
  content jsonb not null,
  solution jsonb not null,
  explanation text not null,
  unique (lesson_id, position)
);

alter table public.exercises enable row level security;

create policy "Signed-in users can read exercises"
  on public.exercises for select to authenticated using (true);

-- Column-level grant: users can read everything except the solution.
revoke all on public.exercises from anon, authenticated;
grant select (id, lesson_id, position, type, content)
  on public.exercises to authenticated;

-- Checks an answer without exposing solutions. For multiple_choice the
-- answer is {"choice": <option index>}.
create function public.check_answer(exercise_id uuid, answer jsonb)
returns table (correct boolean, solution jsonb, explanation text)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  ex public.exercises;
begin
  if (select auth.uid()) is null then
    raise exception 'not signed in';
  end if;

  select * into ex from public.exercises e where e.id = check_answer.exercise_id;
  if not found then
    raise exception 'unknown exercise';
  end if;

  if ex.type = 'multiple_choice' then
    correct := (answer ->> 'choice')::int = (ex.solution ->> 'correct')::int;
  else
    raise exception 'unsupported exercise type %', ex.type;
  end if;

  solution := ex.solution;
  explanation := ex.explanation;
  return next;
end;
$$;

revoke execute on function public.check_answer(uuid, jsonb) from public, anon;
grant execute on function public.check_answer(uuid, jsonb) to authenticated;

-- Completed lessons per user.
create table public.lesson_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null references public.lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

create policy "Users can read their own progress"
  on public.lesson_progress for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own progress"
  on public.lesson_progress for insert to authenticated
  with check ((select auth.uid()) = user_id);

revoke all on public.lesson_progress from anon, authenticated;
grant select, insert on public.lesson_progress to authenticated;
