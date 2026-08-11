const asset = (name: string) => `/delta-assets/${name}`;

export const instagramDemo = {
  username: "deltaconsultorioscitybell",
  displayName: "Delta CB",
  category: "Alquiler de Consultorios/Oficinas",
  location: "467 N° 164, E/ 13A y 13B\nCity Bell, 1896",
  bio: "En el centro de City Bell. Totalmente equipados. Sumate a nuestro equipo de profesionales.",
  profileImage: asset("ig-profile.jpg"),
  whatsapp: "wa.me/message/LHCMI2KUSMFIJ1",
  stats: [
    { label: "Publicaciones", value: "122" },
    { label: "Seguidores", value: "1273" },
    { label: "Seguidos", value: "124" },
  ],
  highlights: [
    { title: "consultorio 2", image: asset("ig-highlight-consultorio-2.jpg") },
    { title: "Profesionales", image: asset("ig-highlight-profesionales.jpg") },
    { title: "ubicacion", image: asset("ig-highlight-ubicacion.jpg") },
    { title: "Consultorio 1", image: asset("ig-highlight-consultorio-1.jpg") },
    { title: "Modulos", image: asset("ig-highlight-modulos.jpg") },
    { title: "Ambientes", image: asset("ig-highlight-ambientes.jpg") },
  ],
  posts: [
    {
      title: "Servicios profesionales",
      type: "Post fijado",
      date: "Mayo 2026",
      image: asset("ig-post-servicios.jpg"),
    },
    {
      title: "Alquiler de consultorios",
      type: "Post fijado",
      date: "04/02/2026",
      image: asset("ig-post-alquiler.jpg"),
    },
    {
      title: "Espacios equipados en City Bell",
      type: "Reel fijado",
      date: "04/02/2026",
      image: asset("ig-post-alquiler-reel.jpg"),
    },
    {
      title: "Servicios de psicologia",
      type: "Post",
      date: "Enero 2026",
      image: asset("ig-post-psicologia.jpg"),
    },
    {
      title: "Consultorio equipado",
      type: "Post",
      date: "04/02/2026",
      image: asset("ig-post-consultorio.jpg"),
    },
    {
      title: "Atencion psicologica",
      type: "Secuencia",
      date: "2026",
      image: asset("ig-post-atencion.jpg"),
    },
    {
      title: "Consultorio infantil",
      type: "Reel",
      date: "2026",
      image: asset("ig-post-consultorio-infantil.jpg"),
    },
    {
      title: "Oficina equipada",
      type: "Post",
      date: "2026",
      image: asset("ig-post-oficina.jpg"),
    },
  ],
  records: [
    { label: "Direccion", value: "Calle 467 N 164, e/13A y 13B - City Bell" },
    { label: "Telefono visible", value: "221 477 8280" },
    { label: "Servicios", value: "Psicologia, aptos psicologicos, terapia de pareja" },
    { label: "Modalidad", value: "Presencial y virtual" },
    { label: "Alquiler", value: "Por modulos, consultorios y oficinas equipadas" },
  ],
};
