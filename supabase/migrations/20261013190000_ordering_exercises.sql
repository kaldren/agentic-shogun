-- Ordering exercises (spec 011): put steps in the right order.
-- content = {question, scenario?, items: [{id, label}]} in a mixed order,
-- solution = {"order": [<item id>]}.
alter table public.exercises drop constraint exercises_type_check;
alter table public.exercises add constraint exercises_type_check
  check (type in ('multiple_choice', 'architecture', 'system_builder', 'ordering'));

-- Same function as before, plus the ordering type. Its answer is
-- {"order": [<item id>]}; it is correct only if every item is in its place.
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
  elsif ex.type = 'system_builder' then
    correct :=
      array(
        select distinct n from jsonb_array_elements_text(answer -> 'nodes') n
        order by n
      ) = array(
        select distinct n from jsonb_array_elements_text(ex.solution -> 'nodes') n
        order by n
      )
      and array(
        select distinct concat(c ->> 'from', '->', c ->> 'to') k
        from jsonb_array_elements(answer -> 'connections') c
        order by k
      ) = array(
        select distinct concat(c ->> 'from', '->', c ->> 'to') k
        from jsonb_array_elements(ex.solution -> 'connections') c
        order by k
      );
  elsif ex.type = 'ordering' then
    correct := (answer -> 'order') = (ex.solution -> 'order');
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
