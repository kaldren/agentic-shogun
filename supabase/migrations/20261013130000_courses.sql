-- Course content: one course per role, made of ordered sections and lessons.
-- Content is read-only for users. It changes only through migrations.
create table public.courses (
  id text primary key,
  role text not null unique, -- a role id from src/lib/roles.ts
  title text not null
);

create table public.sections (
  id text primary key,
  course_id text not null references public.courses (id) on delete cascade,
  position integer not null,
  title text not null,
  unique (course_id, position)
);

create table public.lessons (
  id text primary key,
  section_id text not null references public.sections (id) on delete cascade,
  position integer not null,
  title text not null,
  unique (section_id, position)
);

create index on public.sections (course_id);
create index on public.lessons (section_id);

alter table public.courses enable row level security;
alter table public.sections enable row level security;
alter table public.lessons enable row level security;

create policy "Signed-in users can read courses"
  on public.courses for select to authenticated using (true);
create policy "Signed-in users can read sections"
  on public.sections for select to authenticated using (true);
create policy "Signed-in users can read lessons"
  on public.lessons for select to authenticated using (true);

revoke all on public.courses, public.sections, public.lessons from anon, authenticated;
grant select on public.courses, public.sections, public.lessons to authenticated;
