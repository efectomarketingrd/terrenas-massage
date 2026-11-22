// Fotos de ambiente generadas con Higgsfield (gpt_image_2_6, 16:9, 2k), elegidas por Omar el 22 nov 2026.
// Se enlazan directo desde el CDN de Higgsfield (permitido en next.config.ts → images.remotePatterns).
// Sin personas reconocibles, sin texto ni marcas. No mostrar una "sala del spa" inventada: para "En el spa" usar fotos reales cuando existan.
const cdn = "https://d8j0ntlcm91z4.cloudfront.net/user_3LZ8my4o5R9prXx0ZTCU28u6qVU/";

export const photos = {
  villa: { src: `${cdn}hf_20261122_161521_e147e196-f2ee-40cd-9e1c-6596f32fbc82.png`, w: 2048, h: 1152 },
  pareja: { src: `${cdn}hf_20261122_161520_3537b49a-0168-4716-a33f-7945b1982cbc.png`, w: 2048, h: 1152 },
  grupo: { src: `${cdn}hf_20261122_161519_0b36b760-908e-423b-a12c-e771e60d3426.png`, w: 2048, h: 1152 },
  manos: { src: `${cdn}hf_20261122_161521_9d1a0d65-fd4a-44d4-952c-72663af2f193.png`, w: 2048, h: 1152 },
  bodegon: { src: `${cdn}hf_20261122_161519_01188d6a-8a15-4131-bd6c-4a75b825605f.png`, w: 2048, h: 1152 },
};
