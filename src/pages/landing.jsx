import React from "react";

// Exemple données
const categories = ["Développement", "Marketing", "Design"];
const courses = [
  { title: "React pour débutants", category: "Développement" },
  { title: "UI/UX Design", category: "Design" },
  { title: "Marketing digital", category: "Marketing" },
];

function Landing() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{ padding: "100px 20px", textAlign: "center", background: "#f5f5f5" }}>
        <h1>Bienvenue sur E-Learning</h1>
        <p>Apprenez de nouvelles compétences avec nos cours en ligne</p>
        <button style={{ padding: "10px 20px", marginTop: "20px" }}>Commencer</button>
      </section>

      {/* Catégories */}
      <section style={{ padding: "50px 20px" }}>
        <h2>Catégories populaires</h2>
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          {categories.map((cat, idx) => (
            <div key={idx} style={{ flex: 1, padding: "20px", border: "1px solid #ccc", borderRadius: "8px", textAlign: "center" }}>
              {cat}
            </div>
          ))}
        </div>
      </section>

      {/* Aperçu cours */}
      <section style={{ padding: "50px 20px", background: "#f9f9f9" }}>
        <h2>Cours populaires</h2>
        <div style={{ display: "flex", gap: "20px", marginTop: "20px", flexWrap: "wrap" }}>
          {courses.map((course, idx) => (
            <div key={idx} style={{ flex: "1 1 30%", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
              <h3>{course.title}</h3>
              <p>Catégorie: {course.category}</p>
              <button>Voir le cours</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Landing;