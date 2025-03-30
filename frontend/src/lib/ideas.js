// @lib/ideas.js
export async function getIdeas() {
    const response = await fetch("https://surviving-poppy-sasahershko-72589d6b.koyeb.app/api/ideas");
    if (!response.ok) {
      throw new Error("Error al obtener ideas");
    }
    const data = await response.json();
    return data;
  }
  