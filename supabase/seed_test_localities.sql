-- Seed de 10 localidades de prueba para la fase de diseño.
-- Coordenadas geográficas reales (pueblos auténticos de la España vaciada),
-- descripciones inventadas (placeholder narrativo), audios MP3 de muestra
-- (SoundHelix, públicos y estables), y URLs externas hacia Wikipedia.
--
-- Cómo ejecutar: pega este archivo entero en el SQL Editor de Supabase
-- (proyecto No Me Olvides) y pulsa Run. Se puede ejecutar varias veces sin
-- duplicar gracias a la cláusula ON CONFLICT (basada en el par name+province).

BEGIN;

-- Índice único provisional para que ON CONFLICT funcione (si ya existe, no pasa nada)
CREATE UNIQUE INDEX IF NOT EXISTS localities_name_province_unique
  ON localities (name, province);

INSERT INTO localities
  (name, province, region, latitude, longitude,
   description_es, description_en,
   audio_url_es, audio_url_en, external_url, active)
VALUES
  ('Calatañazor', 'Soria', 'Castilla y León', 41.7186, -2.8003,
   'En las laderas de la sierra de Cabrejas, las casas de adobe y piedra de Calatañazor han visto pasar siete siglos. Aquí, según la leyenda, perdió Almanzor su tambor.',
   'On the slopes of the Sierra de Cabrejas, the adobe and stone houses of Calatañazor have witnessed seven centuries pass. Here, according to legend, Almanzor lost his drum.',
   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
   'https://es.wikipedia.org/wiki/Calata%C3%B1azor', true),

  ('Albarracín', 'Teruel', 'Aragón', 40.4045, -1.4422,
   'Albarracín cuelga sobre el río Guadalaviar como un pueblo de barro rojo y memoria. Sus callejuelas estrechas guardan las voces de quienes las recorrieron durante mil años.',
   'Albarracín hangs over the Guadalaviar river like a village of red clay and memory. Its narrow alleys hold the voices of those who walked them for a thousand years.',
   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
   'https://es.wikipedia.org/wiki/Albarrac%C3%ADn', true),

  ('Atienza', 'Guadalajara', 'Castilla-La Mancha', 41.1933, -2.8703,
   'Atienza fue villa amurallada y plaza de armas. Hoy sus calles silenciosas custodian la memoria de los arrieros que cruzaron la sierra hacia Castilla.',
   'Atienza was once a walled town and military stronghold. Today its silent streets keep the memory of the muleteers who crossed the sierra into Castile.',
   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
   'https://es.wikipedia.org/wiki/Atienza', true),

  ('Cuacos de Yuste', 'Cáceres', 'Extremadura', 40.1133, -5.7378,
   'Bajo los castaños de la Vera, Cuacos guarda los pasos del último Carlos V. Las casas de entramado de madera todavía respiran el aroma del pimentón y la leña.',
   'Beneath the chestnut trees of La Vera, Cuacos preserves the final steps of Charles V. Its half-timbered houses still breathe the aroma of paprika and woodsmoke.',
   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
   'https://es.wikipedia.org/wiki/Cuacos_de_Yuste', true),

  ('Trevélez', 'Granada', 'Andalucía', 36.9967, -3.2700,
   'A más de mil seiscientos metros, Trevélez se acuna entre las cumbres de Sierra Nevada. Sus inviernos largos y silenciosos curaron jamones y curtieron caracteres.',
   'At over 1,600 metres, Trevélez nestles among the peaks of the Sierra Nevada. Its long, silent winters cured hams and shaped strong characters.',
   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
   'https://es.wikipedia.org/wiki/Trev%C3%A9lez', true),

  ('Ujué', 'Navarra', 'Navarra', 42.5167, -1.5022,
   'Ujué se alza como un balcón sobre la Ribera. Su iglesia fortaleza vio nacer leyendas de pastores, romeros y reyes peregrinos.',
   'Ujué rises like a balcony over the Ribera. Its fortified church witnessed the birth of legends of shepherds, pilgrims and wandering kings.',
   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
   'https://es.wikipedia.org/wiki/Uju%C3%A9', true),

  ('Almagro', 'Ciudad Real', 'Castilla-La Mancha', 38.8900, -3.7100,
   'Almagro guarda en su Corral de Comedias la voz del Siglo de Oro. Bajo sus soportales verdes se contaban historias antes de que las contara el papel.',
   'Almagro keeps the voice of the Spanish Golden Age in its Corral de Comedias. Stories were told beneath its green arcades before paper ever recorded them.',
   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
   'https://es.wikipedia.org/wiki/Almagro_(Ciudad_Real)', true),

  ('Mirambel', 'Teruel', 'Aragón', 40.5547, -0.3403,
   'Las murallas de Mirambel cierran un caserío de piedra dorada. Aquí, en el Maestrazgo, el silencio es tan denso que parece tener voz propia.',
   'The walls of Mirambel enclose a hamlet of golden stone. Here, in the Maestrazgo, silence is so dense that it almost seems to have its own voice.',
   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
   'https://es.wikipedia.org/wiki/Mirambel', true),

  ('Frías', 'Burgos', 'Castilla y León', 42.7600, -3.2964,
   'Frías cuelga sobre el Ebro como un nido de águilas. Sus casas colgadas y su castillo desafiante recuerdan que aquí también había fronteras.',
   'Frías hangs above the Ebro like an eagles'' nest. Its hanging houses and defiant castle recall that this was once frontier land.',
   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
   'https://es.wikipedia.org/wiki/Fr%C3%ADas_(Burgos)', true),

  ('Anento', 'Zaragoza', 'Aragón', 41.1500, -1.4400,
   'Anento se esconde en un pliegue de la sierra. Su Aguallueve filtra el agua gota a gota como filtran las palabras los abuelos cuando recuerdan.',
   'Anento hides within a fold of the sierra. Its Aguallueve filters water drop by drop, just as the elders filter words when they remember.',
   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
   'https://es.wikipedia.org/wiki/Anento', true)

ON CONFLICT (name, province) DO NOTHING;

COMMIT;
