
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import { BadgeCheck, Brain, Award, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const HomePage: React.FC = () => {
  const { user, isAdmin } = useAuth();

  const features = [
    {
      title: "Interactive Quizzes",
      description: "Engage with well-crafted questions across various topics to test your knowledge.",
      icon: <Brain className="h-10 w-10 text-primary" />,
    },
    {
      title: "Real-time Feedback",
      description: "Get immediate results and see where you stand among other participants.",
      icon: <BadgeCheck className="h-10 w-10 text-primary" />,
    },
    {
      title: "Competitive Leaderboards",
      description: "Compare your performance with others and climb the rankings.",
      icon: <Award className="h-10 w-10 text-primary" />,
    },
    {
      title: "Timed Challenges",
      description: "Test your speed and accuracy under timed conditions.",
      icon: <Clock className="h-10 w-10 text-primary" />,
    },
  ];

  return (
    <PageLayout>
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in">
                  Test Your Knowledge with&nbsp;
                  <span className="text-primary">SkillHub</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl animate-fade-in delay-200">
                  Interactive quizzes that challenge your mind and track your progress. Compete with others and become the ultimate quiz champion.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 animate-fade-in delay-300">
                {isAdmin ? (
                  <Button asChild size="lg">
                    <Link to="/admin/quizzes">Manage Quizzes</Link>
                  </Button>
                ) : (
                  <Button asChild size="lg">
                    <Link to="/quizzes">Take a Quiz</Link>
                  </Button>
                )}
                <Button variant="outline" size="lg" asChild>
                  <Link to="/leaderboard">View Leaderboard</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="glass-panel rounded-2xl p-6 md:p-10 animate-fade-in relative">
                  <div className="aspect-square w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-6">
                      <div className="text-6xl md:text-8xl font-bold text-primary/80">?</div>
                      <h3 className="text-xl md:text-2xl font-bold">Challenge Your Mind</h3>
                      <p className="text-muted-foreground">
                        Get ready to put your knowledge to the test with our diverse collection of quizzes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Features</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              SkillHub offers a comprehensive platform for knowledge assessment and competitive learning
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 rounded-xl hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 150 + 300}ms` }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-primary/10 rounded-full">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-t from-background to-secondary/20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="glass-panel rounded-xl p-6 animate-fade-in">
                <div className="bg-primary/5 rounded-lg p-6 md:p-10">
                  <div className="flex flex-col space-y-4">
                    <div className="h-8 w-3/4 bg-primary/10 rounded-full"></div>
                    <div className="h-8 w-2/3 bg-primary/10 rounded-full"></div>
                    <div className="h-8 w-5/6 bg-primary/10 rounded-full"></div>
                    <div className="h-8 w-1/2 bg-primary/10 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 space-y-6 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Test Your Skills?</h2>
              <p className="text-muted-foreground text-lg">
                Join thousands of users who are already improving their knowledge with SkillHub's interactive quizzes. Sign up today and start your learning journey.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                {user ? (
                  <Button asChild size="lg">
                    <Link to="/quizzes">Take a Quiz</Link>
                  </Button>
                ) : (
                  <Button asChild size="lg">
                    <Link to="/register">Sign Up Now</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default HomePage;
