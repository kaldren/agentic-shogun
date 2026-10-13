-- Several courses per role (spec 010). Courses of a role are ordered by
-- position; the first one is the default.
alter table public.courses drop constraint courses_role_key;
alter table public.courses add column position integer not null default 1;
alter table public.courses alter column position drop default;
alter table public.courses add constraint courses_role_position_key
  unique (role, position);

-- The course the user is learning. Null means the first course of their
-- role. It is cleared when the course is deleted.
alter table public.profiles add column current_course_id text
  references public.courses (id) on delete set null;

-- Users may only pick a course of their own role.
create function public.is_course_of_role(course_id text, role text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.courses c
    where c.id = is_course_of_role.course_id and c.role = is_course_of_role.role
  );
$$;

revoke execute on function public.is_course_of_role(text, text) from public, anon;
grant execute on function public.is_course_of_role(text, text) to authenticated;

drop policy "Users can create their own profile" on public.profiles;
create policy "Users can create their own profile"
  on public.profiles for insert
  to authenticated
  with check (
    (select auth.uid()) = id
    and (current_course_id is null
      or public.is_course_of_role(current_course_id, role))
  );

drop policy "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check (
    (select auth.uid()) = id
    and (current_course_id is null
      or public.is_course_of_role(current_course_id, role))
  );
