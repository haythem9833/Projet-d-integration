"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export function LandingPage() {
  const features = [
    {
      icon: "🎬",
      title: "Vidéos Pédagogiques",
      description: "Des cours vidéo de haute qualité créés par des professeurs experts",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: "📚",
      title: "Plusieurs Matières",
      description: "Explorez une large gamme de sujets et de disciplines",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: "⚡",
      title: "Apprenez à Votre Rythme",
      description: "Progressez à votre propre vitesse, quand vous le souhaitez",
      color: "from-teal-500 to-teal-600",
    },
    {
      icon: "🏆",
      title: "Certificats",
      description: "Obtenez des certificats reconnus après chaque cours",
      color: "from-lime-500 to-lime-600",
    },
    {
      icon: "👨‍🏫",
      title: "Professeurs Experts",
      description: "Apprenez auprès des meilleurs professionnels du secteur",
      color: "from-blue-600 to-emerald-600",
    },
    {
      icon: "💬",
      title: "Communauté Active",
      description: "Connectez-vous avec d'autres apprenants et partagez vos expériences",
      color: "from-teal-600 to-cyan-600",
    },
  ];

  const stats = [
    { number: "50K+", label: "Étudiants Actifs" },
    { number: "500+", label: "Cours Disponibles" },
    { number: "100+", label: "Professeurs" },
    { number: "4.8★", label: "Note Moyenne" },
  ];

  const courses = [
    {
      title: "React Basics",
      category: "Programming",
      level: "Beginner",
      students: "2.5K",
      rating: "4.9",
    },
    {
      title: "Web Design Fundamentals",
      category: "Design",
      level: "Beginner",
      students: "1.8K",
      rating: "4.8",
    },
    {
      title: "Advanced JavaScript",
      category: "Programming",
      level: "Advanced",
      students: "1.2K",
      rating: "4.7",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white text-gray-900">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            🎓 EduStream
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline" className="border-blue-300 hover:bg-blue-100 text-gray-900">
                Se Connecter
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700">S'inscrire</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <div className="mb-6 inline-block">
            <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full text-sm text-blue-700">
              ✨ Bienvenue sur la plateforme d'apprentissage du futur
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Apprenez les <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">compétences</span> de demain
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-4">
            Accédez à des milliers de cours vidéo pédagogiques créés par des experts
          </p>

          <p className="text-lg text-gray-500 mb-12">
            Progressez à votre rythme • Obtenez des certificats • Rejoignez une communauté mondiale
          </p>

          <div className="flex gap-4 justify-center flex-wrap mb-12">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-6">
                Commencer Gratuitement
              </Button>
            </Link>
            <Link href="/student/courses">
              <Button size="lg" variant="outline" className="border-blue-300 hover:bg-blue-100 text-gray-900 text-lg px-8 py-6">
                Voir les Cours
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-blue-600">{stat.number}</p>
                <p className="text-gray-600 text-sm mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Courses Section */}
      <div className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Cours Populaires</h2>
            <p className="text-gray-600 text-lg">Découvrez nos cours les plus appréciés</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {courses.map((course, index) => (
              <Card key={index} className="bg-white border-gray-200 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="w-full h-40 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-lg mb-4" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{course.title}</h3>
                  <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">{course.category}</span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded">{course.level}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{course.students} étudiants</span>
                    <span className="text-yellow-400">⭐ {course.rating}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/student/courses">
              <Button size="lg" variant="outline" className="border-blue-300 hover:bg-blue-100 text-gray-900">
                Voir Tous les Cours →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Pourquoi nous choisir?</h2>
            <p className="text-gray-600 text-lg">Découvrez ce qui nous rend différents</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white border-gray-200 hover:border-blue-500 transition-all group">
                <CardContent className="p-8">
                  <div className={`text-6xl mb-4 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Comment ça marche?</h2>
            <p className="text-gray-600 text-lg">Trois étapes simples pour commencer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "S'inscrire",
                description: "Créez votre compte gratuitement en quelques secondes",
              },
              {
                step: "2",
                title: "Choisir un Cours",
                description: "Parcourez nos milliers de cours et trouvez celui qui vous intéresse",
              },
              {
                step: "3",
                title: "Apprendre & Progresser",
                description: "Regardez les vidéos et obtenez des certificats",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Ce que disent nos étudiants</h2>
            <p className="text-gray-600 text-lg">Découvrez les avis de nos utilisateurs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Marie Dupont",
                role: "Étudiante",
                text: "Excellente plateforme! Les cours sont bien structurés et les professeurs sont très compétents.",
                rating: 5,
              },
              {
                name: "Jean Martin",
                role: "Développeur",
                text: "J'ai appris React en seulement 2 semaines. Les vidéos sont claires et faciles à suivre.",
                rating: 5,
              },
              {
                name: "Sophie Bernard",
                role: "Designer",
                text: "La meilleure plateforme d'apprentissage que j'ai jamais utilisée. Hautement recommandée!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-white border-gray-200">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-6 text-white">Prêt à transformer votre carrière?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Rejoignez des milliers d'étudiants qui apprennent déjà et progressent dans leur carrière
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                  Commencer Maintenant
                </Button>
              </Link>
              <Link href="/student/courses">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                  Voir les Cours
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4 relative z-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">EduStream</h3>
              <p className="text-gray-600">La plateforme d'apprentissage du futur</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-900">Produit</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition">Cours</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Certificats</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Professeurs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-900">Entreprise</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition">À propos</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-900">Légal</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition">Confidentialité</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Conditions</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-gray-600">
            <p>&copy; 2026 EduStream. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

