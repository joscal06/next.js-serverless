-- =====================================================================
-- Destinos SV · Datos de ejemplo
-- Ejecutar DESPUÉS de schema.sql. Es idempotente.
-- Precios de entrada: referenciales para visitantes extranjeros (USD).
-- =====================================================================

insert into public.categorias (slug, nombre, descripcion, icono, color, imagen_url, orden) values
  ('playas', 'Playas', 'Más de 300 km de costa pacífica: olas de clase mundial para el surf, arena volcánica y atardeceres que tiñen el cielo de naranja.', '🌊', '#0e7490', '/img/destinos/playa-el-tunco.jpg', 1),
  ('volcanes', 'Volcanes', 'La tierra de los volcanes: cráteres activos, lagunas de azufre y senderos con vistas a medio país.', '🌋', '#b45309', '/img/destinos/volcan-de-santa-ana.jpg', 2),
  ('lagos-y-lagunas', 'Lagos y lagunas', 'Calderas volcánicas convertidas en espejos de agua: kayak, lanchas y restaurantes a la orilla.', '🏞️', '#0369a1', '/img/destinos/lago-de-coatepeque.jpg', 3),
  ('pueblos-con-encanto', 'Pueblos con encanto', 'Calles empedradas, murales, café de altura y festivales gastronómicos de fin de semana.', '🏘️', '#be123c', '/img/destinos/ruta-de-las-flores.jpg', 4),
  ('arqueologia', 'Arqueología', 'Sitios mayas y precolombinos que cuentan la historia de los pueblos que habitaron la región hace más de mil años.', '🗿', '#7c2d12', '/img/destinos/tazumal.jpg', 5),
  ('naturaleza', 'Naturaleza', 'Bosques nubosos, manglares y áreas protegidas con una biodiversidad sorprendente para un país tan pequeño.', '🌿', '#15803d', '/img/destinos/parque-nacional-el-imposible.jpg', 6)
on conflict (slug) do update set
  nombre = excluded.nombre,
  descripcion = excluded.descripcion,
  icono = excluded.icono,
  color = excluded.color,
  imagen_url = excluded.imagen_url,
  orden = excluded.orden;

with datos (slug, nombre, departamento, categoria, resumen, descripcion, imagen, credito, precio, epoca, duracion, actividades, destacado) as (
  values
  ('lago-de-coatepeque', 'Lago de Coatepeque', 'Santa Ana', 'lagos-y-lagunas',
   'Un lago de caldera volcánica famoso por su intenso color turquesa.',
   'El Lago de Coatepeque ocupa una caldera formada por antiguas erupciones en la sierra de Apaneca-Ilamatepec. Su agua cambia de tonalidad y en algunas temporadas se vuelve de un turquesa intenso por la presencia de microorganismos. En el centro se encuentra la isla Teopán, considerada sitio sagrado por los pueblos originarios.' || chr(10) || chr(10) || 'Los miradores de la carretera ofrecen una de las postales más fotografiadas del país. Abajo, a la orilla, hay restaurantes con muelle, paseos en lancha, kayak y paddle board.',
   '/img/destinos/lago-de-coatepeque.jpg', 'JMRAFFi · CC BY-SA 4.0 · Wikimedia Commons', 0.00,
   'Todo el año; de noviembre a abril el cielo suele estar más despejado', 'Medio día o un día completo',
   array['Kayak', 'Paseos en lancha', 'Miradores', 'Gastronomía'], true),

  ('volcan-de-santa-ana', 'Volcán de Santa Ana (Ilamatepec)', 'Santa Ana', 'volcanes',
   'El volcán más alto de El Salvador, con una laguna verde de azufre en su cráter.',
   'Con unos 2,381 metros sobre el nivel del mar, el Ilamatepec es el volcán más alto del país. El ascenso parte del Parque Nacional Cerro Verde y se realiza con guías y agentes de seguridad en horarios establecidos.' || chr(10) || chr(10) || 'La caminata dura entre hora y media y dos horas de subida. En la cima espera una laguna cratérica de color verde esmeralda que desprende gases sulfurosos, con vistas al Lago de Coatepeque y al volcán de Izalco.',
   '/img/destinos/volcan-de-santa-ana.jpg', 'Erneestoo · CC BY-SA 4.0 · Wikimedia Commons', 6.00,
   'Noviembre a abril (estación seca)', '4 a 5 horas',
   array['Senderismo', 'Fotografía', 'Observación de cráter'], true),

  ('playa-el-tunco', 'Playa El Tunco', 'La Libertad', 'playas',
   'Capital del surf salvadoreño, con su icónica roca en forma de tunco.',
   'El Tunco debe su nombre a la gran formación rocosa que, según los lugareños, se parece a un tunco (cerdo). Es uno de los puntos centrales de Surf City, la franja costera de La Libertad conocida por sus olas constantes durante todo el año.' || chr(10) || chr(10) || 'Tiene ambiente bohemio, hostales, escuelas de surf, restaurantes de mariscos y vida nocturna. Los atardeceres detrás de la roca son un espectáculo diario.',
   '/img/destinos/playa-el-tunco.jpg', 'William Adach · CC BY-SA 2.0 · Wikimedia Commons', 0.00,
   'Todo el año; olas más grandes de marzo a octubre', 'Un fin de semana',
   array['Surf', 'Vida nocturna', 'Atardeceres', 'Mariscos'], true),

  ('playa-el-cuco', 'Playa El Cuco', 'San Miguel', 'playas',
   'Una playa amplia y tranquila del oriente, ideal para descansar en familia.',
   'En el municipio de Chirilagua, El Cuco ofrece kilómetros de arena gris y un oleaje más suave que el de las playas de La Libertad. Es el destino de playa favorito del oriente del país.' || chr(10) || chr(10) || 'Cerca se encuentran playas aún más vírgenes como Las Flores (con buenas olas para surf) y El Esterón, donde el estero se encuentra con el mar.',
   '/img/destinos/playa-el-cuco.jpg', 'Ll1324 · CC0 · Wikimedia Commons', 0.00,
   'Noviembre a abril', 'Un fin de semana',
   array['Descanso', 'Natación', 'Paseos a caballo', 'Mariscos'], false),

  ('playa-el-zonte', 'Playa El Zonte', 'La Libertad', 'playas',
   'Pequeña bahía de surf conocida mundialmente como Bitcoin Beach.',
   'El Zonte es una bahía de arena oscura y rocas, rodeada de vegetación, donde una ola de derecha atrae a surfistas de todo el mundo. En 2019 la comunidad inició un proyecto de economía circular con bitcoin que le valió el apodo de Bitcoin Beach.' || chr(10) || chr(10) || 'Es más tranquila que El Tunco y perfecta para quienes buscan surf, yoga y hospedajes pequeños frente al mar.',
   '/img/destinos/playa-el-zonte.jpg', 'Martin Haeusler · CC BY-SA 3.0 · Wikimedia Commons', 0.00,
   'Todo el año', 'Un fin de semana',
   array['Surf', 'Yoga', 'Atardeceres'], false),

  ('suchitoto', 'Suchitoto', 'Cuscatlán', 'pueblos-con-encanto',
   'La capital cultural: calles empedradas y vista al lago Suchitlán.',
   'Suchitoto conserva su arquitectura colonial de casas de adobe, tejas rojas y calles empedradas. Su iglesia de Santa Lucía, de fachada blanca, preside el parque central.' || chr(10) || chr(10) || 'Es conocida como la capital cultural de El Salvador por sus galerías, festivales de arte y talleres de añil. Desde el pueblo se puede bajar al embalse Suchitlán para paseos en lancha y avistamiento de aves, o visitar la cascada Los Tercios, de columnas de roca basáltica.',
   '/img/destinos/suchitoto.jpg', 'SWENOWENSON · CC BY-SA 4.0 · Wikimedia Commons', 0.00,
   'Todo el año; febrero, por el Festival de Arte y Cultura', 'Un día completo',
   array['Arte y cultura', 'Talleres de añil', 'Paseos en lancha', 'Cascadas'], true),

  ('ruta-de-las-flores', 'Ruta de las Flores', 'Sonsonate y Ahuachapán', 'pueblos-con-encanto',
   'Pueblos de montaña, cafetales, murales y festivales gastronómicos.',
   'La Ruta de las Flores recorre unos 36 km por la cordillera de Apaneca, conectando Nahuizalco, Salcoatitán, Juayúa, Apaneca y Concepción de Ataco. Debe su nombre a las flores que cubren la carretera entre octubre y febrero.' || chr(10) || chr(10) || 'Los fines de semana, la Feria Gastronómica de Juayúa llena el parque de platillos típicos. Ataco es famoso por sus murales coloridos, y Apaneca por el café de altura y las actividades de aventura como el canopy.',
   '/img/destinos/ruta-de-las-flores.jpg', 'Sammiethedeadrat · CC BY-SA 3.0 · Wikimedia Commons', 0.00,
   'Octubre a febrero (floración)', 'Uno o dos días',
   array['Gastronomía', 'Tours de café', 'Murales', 'Canopy'], true),

  ('joya-de-ceren', 'Joya de Cerén', 'La Libertad', 'arqueologia',
   'La «Pompeya de América»: una aldea maya preservada bajo ceniza volcánica.',
   'Alrededor del año 600 d. C., la erupción del volcán Loma Caldera sepultó bajo metros de ceniza a esta aldea agrícola. Sus habitantes lograron huir, pero dejaron intactas sus viviendas, bodegas, cultivos y hasta un temazcal (baño de vapor).' || chr(10) || chr(10) || 'Gracias a su estado de conservación, único en Mesoamérica, fue declarada Patrimonio de la Humanidad por la UNESCO en 1993. Permite conocer cómo era la vida cotidiana de la gente común, no solo de las élites.',
   '/img/destinos/joya-de-ceren.jpg', 'Mariordo (Mario Roberto Duran Ortiz) · CC BY-SA 3.0 · Wikimedia Commons', 3.00,
   'Todo el año (martes a domingo)', '2 horas',
   array['Historia', 'Museo', 'Visita guiada'], true),

  ('tazumal', 'Tazumal', 'Santa Ana', 'arqueologia',
   'El sitio maya más emblemático del país, en el corazón de Chalchuapa.',
   'Tazumal forma parte de la zona arqueológica de Chalchuapa, uno de los asentamientos más antiguos y de ocupación más prolongada de Mesoamérica. Su estructura principal es una pirámide escalonada rodeada de plataformas y un juego de pelota.' || chr(10) || chr(10) || 'El museo del sitio exhibe cerámica, esculturas y objetos que muestran el intercambio comercial con otras regiones mayas.',
   '/img/destinos/tazumal.jpg', 'Mariordo (Mario Roberto Durán Ortiz) · CC BY-SA 3.0 · Wikimedia Commons', 3.00,
   'Todo el año (martes a domingo)', '2 horas',
   array['Historia', 'Museo', 'Fotografía'], false),

  ('san-andres', 'San Andrés', 'La Libertad', 'arqueologia',
   'Antigua capital regional maya en el valle de Zapotitán.',
   'San Andrés fue un importante centro cívico-ceremonial maya entre los años 600 y 900 d. C. Su Acrópolis y su gran pirámide de tierra, la Campana, dominan un amplio parque rodeado de campos de caña.' || chr(10) || chr(10) || 'El museo explica la relación entre este sitio y Joya de Cerén, que están a pocos kilómetros, y exhibe restos de un obraje de añil de la época colonial.',
   '/img/destinos/san-andres.jpg', 'Mariordo (Mario Roberto Duran Ortiz) · CC BY-SA 3.0 · Wikimedia Commons', 3.00,
   'Todo el año (martes a domingo)', '2 horas',
   array['Historia', 'Museo', 'Picnic'], false),

  ('lago-de-ilopango', 'Lago de Ilopango', 'San Salvador, Cuscatlán y La Paz', 'lagos-y-lagunas',
   'El lago más grande del país, a pocos minutos de la capital.',
   'Ilopango ocupa una enorme caldera formada por una de las mayores erupciones de los últimos milenios en la región, ocurrida hacia el siglo V d. C. Hoy es el lago natural más grande de El Salvador.' || chr(10) || chr(10) || 'Sus orillas ofrecen restaurantes, paseos en lancha hasta los Cerros Quemados (islotes que emergieron en 1880), buceo en aguas volcánicas y deportes acuáticos.',
   '/img/destinos/lago-de-ilopango.jpg', 'Lee Siebert (Smithsonian Institution) · Public domain · Wikimedia Commons', 0.00,
   'Todo el año', 'Medio día',
   array['Paseos en lancha', 'Buceo', 'Gastronomía'], false),

  ('laguna-de-alegria', 'Laguna de Alegría', 'Usulután', 'lagos-y-lagunas',
   'La «Esmeralda de América», escondida en el cráter del volcán Tecapa.',
   'Esta laguna de aguas verdes y sulfurosas se encuentra en el cráter del volcán Tecapa, sobre el pintoresco municipio de Alegría. La poeta chilena Gabriela Mistral la llamó la «Esmeralda de América».' || chr(10) || chr(10) || 'El pueblo de Alegría, uno de los más altos del país, tiene clima fresco, viveros de plantas ornamentales y miradores hacia la bahía de Jiquilisco.',
   '/img/destinos/laguna-de-alegria.jpg', 'ElmerGuevara · CC BY-SA 3.0 · Wikimedia Commons', 1.00,
   'Noviembre a abril', 'Medio día',
   array['Senderismo', 'Clima fresco', 'Viveros'], false),

  ('el-boqueron', 'Parque Nacional El Boquerón', 'La Libertad', 'volcanes',
   'El cráter del volcán de San Salvador, con un cono dentro de otro.',
   'En la cima del volcán de San Salvador se abre un cráter de alrededor de 1.5 km de diámetro y más de 500 metros de profundidad. En su fondo se levanta el Boqueroncito, un pequeño cono formado en la erupción de 1917.' || chr(10) || chr(10) || 'Un sendero corto y bien señalizado lleva a varios miradores. La zona tiene clima fresco, cafeterías y viveros, a solo 30 minutos de San Salvador.',
   '/img/destinos/el-boqueron.jpg', 'Jpyle490 · CC BY-SA 3.0 · Wikimedia Commons', 3.00,
   'Todo el año; mañanas despejadas', '2 a 3 horas',
   array['Senderismo', 'Miradores', 'Cafeterías'], true),

  ('parque-nacional-el-imposible', 'Parque Nacional El Imposible', 'Ahuachapán', 'naturaleza',
   'El bosque tropical más extenso del país, con ríos, pozas y cascadas.',
   'El Imposible protege uno de los últimos grandes remanentes de bosque tropical seco de la costa pacífica centroamericana. Su nombre viene de un desfiladero que en el pasado era casi imposible de cruzar para los arrieros que transportaban café.' || chr(10) || chr(10) || 'Sus senderos llevan a pozas cristalinas, cascadas y miradores. Alberga cientos de especies de aves, mamíferos como el tigrillo y una flora muy diversa.',
   '/img/destinos/parque-nacional-el-imposible.jpg', 'ElmerGuevara · CC BY-SA 3.0 · Wikimedia Commons', 6.00,
   'Noviembre a abril', 'Un día completo',
   array['Senderismo', 'Avistamiento de aves', 'Pozas y cascadas'], false),

  ('bahia-de-jiquilisco', 'Bahía de Jiquilisco', 'Usulután', 'naturaleza',
   'Manglares, islas y tortugas marinas en la reserva de biosfera del oriente.',
   'La Bahía de Jiquilisco es el mayor humedal salobre del país, con extensos bosques de manglar, esteros e islas como la de Méndez y San Sebastián. Es sitio Ramsar y Reserva de Biosfera reconocida por la UNESCO.' || chr(10) || chr(10) || 'Es una zona clave para la anidación de tortugas marinas, incluida la tortuga carey. Desde Puerto El Triunfo salen tours en lancha para recorrer los canales de manglar.',
   '/img/destinos/bahia-de-jiquilisco.jpg', 'ElmerGuevara · CC BY-SA 3.0 · Wikimedia Commons', 0.00,
   'Julio a diciembre para ver anidación de tortugas', 'Un día completo',
   array['Tours en lancha', 'Manglares', 'Tortugas marinas', 'Pesca artesanal'], false),

  ('parque-nacional-montecristo', 'Parque Nacional Montecristo', 'Santa Ana', 'naturaleza',
   'Bosque nuboso en el Trifinio, donde se unen tres países.',
   'Ubicado en Metapán, Montecristo protege un bosque nuboso con robles, pinos, helechos arborescentes y orquídeas. En su cumbre se encuentra el punto Trifinio, donde se unen El Salvador, Guatemala y Honduras.' || chr(10) || chr(10) || 'Su altura y lejanía de las ciudades lo convierten en un gran lugar para acampar y observar las estrellas. Parte del bosque cierra temporalmente durante la época reproductiva de la fauna; conviene consultar antes de ir.',
   '/img/destinos/parque-nacional-montecristo.jpg', 'ElmerGuevara · CC BY-SA 3.0 · Wikimedia Commons', 6.00,
   'Noviembre a abril', 'Uno o dos días',
   array['Camping', 'Observación de estrellas', 'Senderismo'], false)
)
insert into public.destinos (slug, nombre, departamento, categoria_id, resumen, descripcion, imagen_url, imagen_credito, precio_entrada, mejor_epoca, duracion, actividades, destacado)
select d.slug, d.nombre, d.departamento, c.id, d.resumen, d.descripcion, d.imagen, d.credito, d.precio, d.epoca, d.duracion, d.actividades, d.destacado
from datos d
join public.categorias c on c.slug = d.categoria
on conflict (slug) do update set
  nombre = excluded.nombre,
  departamento = excluded.departamento,
  categoria_id = excluded.categoria_id,
  resumen = excluded.resumen,
  descripcion = excluded.descripcion,
  imagen_url = excluded.imagen_url,
  imagen_credito = excluded.imagen_credito,
  precio_entrada = excluded.precio_entrada,
  mejor_epoca = excluded.mejor_epoca,
  duracion = excluded.duracion,
  actividades = excluded.actividades,
  destacado = excluded.destacado;

-- Reseñas de ejemplo (sin token: nadie puede editarlas desde el sitio)
delete from public.resenas where token_hash is null;

insert into public.resenas (destino_id, autor, calificacion, comentario, created_at)
select d.id, r.autor, r.calificacion, r.comentario, now() - (r.dias || ' days')::interval
from (values
  ('lago-de-coatepeque', 'Andrea M.', 5, 'El color del agua es increíble. Almorzamos en un restaurante con muelle y luego rentamos kayaks. Imperdible.', 40),
  ('lago-de-coatepeque', 'Carlos R.', 4, 'Hermoso lugar, pero lleva efectivo porque varios lugares no aceptan tarjeta. El mirador de la carretera vale la pena.', 12),
  ('volcan-de-santa-ana', 'Daniela P.', 5, 'La subida es exigente pero muy bien organizada con guías. Ver la laguna verde en el cráter no tiene precio.', 30),
  ('volcan-de-santa-ana', 'Luis H.', 5, 'Lleguen temprano, el cupo del primer grupo se llena. Llevar agua, bloqueador y una chaqueta ligera.', 8),
  ('volcan-de-santa-ana', 'Sofía G.', 4, 'Espectacular. Solo hay que tener paciencia con los horarios de salida del sendero.', 3),
  ('playa-el-tunco', 'Marco T.', 5, 'Tomé mi primera clase de surf y fue genial. El ambiente al atardecer frente a la roca es único.', 25),
  ('playa-el-tunco', 'Valeria C.', 4, 'Muy animado los fines de semana. Entre semana es más tranquilo y se disfruta más.', 6),
  ('playa-el-cuco', 'Roberto A.', 4, 'Playa amplia y limpia, perfecta para ir con niños. Los mariscos frescos en los comedores son muy buenos.', 18),
  ('playa-el-zonte', 'Emily W.', 5, 'Quiet surf town with great waves and friendly locals. Paid for my coffee with bitcoin!', 22),
  ('suchitoto', 'Gabriela F.', 5, 'Un pueblo precioso. Hicimos un taller de añil y compramos artesanías. La vista al lago desde el mirador es hermosa.', 35),
  ('suchitoto', 'Jorge L.', 4, 'Ideal para caminar sin prisa. La cascada Los Tercios estaba seca en verano, mejor ir en época de lluvia.', 14),
  ('ruta-de-las-flores', 'Paola N.', 5, 'La feria gastronómica de Juayúa es lo mejor. Probamos de todo y el café de Apaneca es delicioso.', 20),
  ('ruta-de-las-flores', 'Ricardo S.', 5, 'Los murales de Ataco son preciosos. Recomiendo quedarse una noche en un hostal de montaña.', 9),
  ('joya-de-ceren', 'Fernanda V.', 5, 'Impresionante ver cómo vivían las familias hace 1,400 años. Los guías explican todo muy bien.', 27),
  ('tazumal', 'Miguel Á.', 4, 'La pirámide es imponente y el museo está bien cuidado. Queda en pleno centro de Chalchuapa.', 16),
  ('san-andres', 'Karla E.', 4, 'Muy bonito y tranquilo. Combinamos la visita con Joya de Cerén en la misma mañana.', 11),
  ('el-boqueron', 'Diego B.', 5, 'A media hora de la capital y con un clima delicioso. El cráter es enorme, se ve el Boqueroncito clarito.', 19),
  ('el-boqueron', 'Natalia O.', 4, 'Sendero fácil, apto para toda la familia. Llegar temprano antes de que suba la neblina.', 4),
  ('parque-nacional-el-imposible', 'Esteban J.', 5, 'Hicimos el sendero a las pozas con un guía local. Naturaleza pura, vimos muchísimas aves.', 45),
  ('bahia-de-jiquilisco', 'Lucía Q.', 5, 'El tour en lancha por los manglares fue mágico. Tuvimos la suerte de ver una liberación de tortugas.', 33),
  ('laguna-de-alegria', 'Óscar M.', 4, 'La laguna tiene un color muy particular y el pueblo de Alegría es encantador y fresco.', 28),
  ('parque-nacional-montecristo', 'Rebeca D.', 5, 'Acampamos una noche y el cielo estrellado fue inolvidable. Hace frío, lleven buen abrigo.', 50)
) as r(slug, autor, calificacion, comentario, dias)
join public.destinos d on d.slug = r.slug;
