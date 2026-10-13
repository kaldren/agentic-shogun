-- Architecture exercises (spec 007): drag cloud services into the slots of a
-- diagram. content = {question, scenario, slots, cards, flows},
-- solution = {"slots": {<slot id>: <card id>}}.
alter table public.exercises drop constraint exercises_type_check;
alter table public.exercises add constraint exercises_type_check
  check (type in ('multiple_choice', 'architecture'));

-- Same function as before, plus the architecture type. Its answer is
-- {"placements": {<slot id>: <card id>}}; it is correct only if every slot
-- holds its correct card.
create or replace function public.check_answer(exercise_id uuid, answer jsonb)
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
  elsif ex.type = 'architecture' then
    correct := not exists (
      select 1
      from jsonb_each_text(ex.solution -> 'slots') s
      where (answer -> 'placements' ->> s.key) is distinct from s.value
    );
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
