-- Cartas de una foránea: saber qué página trae a cada persona (Diego, 15-nov-2026).
-- Repo avelina (no pilsi) para no chocar con las migraciones del agente de Pilsi; misma base (bgnonjbkowraazdepexx).
-- Se aplicó con la API de gestión de Supabase y quedó registrada en supabase_migrations.schema_migrations.
--   origen:    la página de avelina.com.mx donde la persona dejó su correo (ruta, p. ej. /carta-para-mi-mama/)
--   entrada:   la primera página de esa visita (por donde llegó, casi siempre desde Google)
--   referente: sólo el dominio de donde venía al entrar (p. ej. www.google.com); nunca la URL completa
alter table public.cartas_avelina add column if not exists origen text;
alter table public.cartas_avelina add column if not exists entrada text;
alter table public.cartas_avelina add column if not exists referente text;

alter table public.cartas_avelina drop constraint if exists cartas_avelina_origen_check;
alter table public.cartas_avelina add constraint cartas_avelina_origen_check check (
  (origen is null or (char_length(origen) <= 300 and origen ~ '^/'))
  and (entrada is null or (char_length(entrada) <= 300 and entrada ~ '^/'))
  and (referente is null or (char_length(referente) <= 120 and referente ~ '^[a-z0-9.-]+$'))
);

grant insert (origen, entrada, referente) on public.cartas_avelina to anon;

comment on column public.cartas_avelina.origen is 'Ruta de la página donde se apuntó (la pone js/sitio.js).';
comment on column public.cartas_avelina.entrada is 'Primera página de la visita, por donde llegó (js/sitio.js, sessionStorage).';
comment on column public.cartas_avelina.referente is 'Dominio de donde venía al entrar (sólo el host).';

create index if not exists cartas_avelina_origen_idx on public.cartas_avelina (origen);
