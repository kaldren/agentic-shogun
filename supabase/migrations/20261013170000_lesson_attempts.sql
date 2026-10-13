-- Where a user is inside a lesson (spec 009), so they can leave and resume.
-- queue: exercises still to do, in order (wrong answers are asked again at
-- the end); done: exercises answered correctly. Only ids, never solutions.
-- The row is deleted when the lesson is finished or started over.
create table public.lesson_attempts (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null references public.lessons (id) on delete cascade,
  queue uuid[] not null,
  done uuid[] not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.lesson_attempts enable row level security;

create policy "Users can read their own attempts"
  on public.lesson_attempts for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own attempts"
  on public.lesson_attempts for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own attempts"
  on public.lesson_attempts for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own attempts"
  on public.lesson_attempts for delete to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.lesson_attempts from anon, authenticated;
grant select, insert, update, delete on public.lesson_attempts to authenticated;
