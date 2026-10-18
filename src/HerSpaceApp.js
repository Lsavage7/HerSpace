import React, { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { communityMoments, lifeStages, trustedAdvice } from "./data/content";

const tabs = [
  { key: "home", label: "Home", icon: "home" },
  { key: "advice", label: "Advice", icon: "verified-user" },
  { key: "circles", label: "Circles", icon: "groups" },
  { key: "game", label: "Game", icon: "sports-esports" },
];

const safetyPledges = [
  "I will keep this space respectful and free from harassment.",
  "I understand crisis resources are available for urgent support.",
  "I agree to protect privacy inside community circles.",
];

const herQuestCards = [
  {
    prompt: "A friend sends a rude comment in your support circle. What should you do first?",
    options: [
      "Report it and save the screenshot so moderators can review it.",
      "Reply in the same tone to defend yourself.",
      "Ignore it and hope nobody sees it.",
    ],
    answer: 0,
  },
  {
    prompt: "You feel overwhelmed and need a reset. What is the healthiest next move?",
    options: [
      "Push through without telling anyone.",
      "Take a breathing break and message a trusted person.",
      "Delete the app and avoid support entirely.",
    ],
    answer: 1,
  },
  {
    prompt: "Someone asks for private details you do not feel comfortable sharing. What is the best response?",
    options: [
      "Pretend to agree and then share later.",
      "Share everything to be polite.",
      "Set a clear boundary and redirect the conversation.",
    ],
    answer: 2,
  },
  {
    prompt: "Your goal is to build a safe community. What helps most?",
    options: [
      "Making everyone compete for attention.",
      "Encouraging respect, privacy, and kind accountability.",
      "Posting every personal detail for validation.",
    ],
    answer: 1,
  },
];

export default function HerSpaceApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [screen, setScreen] = useState("auth");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedStage, setSelectedStage] = useState(lifeStages[0].id);
  const [acceptedPledges, setAcceptedPledges] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const sectionTitle = useMemo(() => {
    if (activeTab === "advice") return "Trusted Advice Feed";
    if (activeTab === "circles") return "Community Support Circles";
    if (activeTab === "game") return "HerSpace Quest";
    return "Your Safety + Support Dashboard";
  }, [activeTab]);

  const selectedStageLabel = useMemo(() => {
    const stage = lifeStages.find((item) => item.id === selectedStage);
    return stage ? stage.stage : "Your Stage";
  }, [selectedStage]);

  const acceptedAllPledges = acceptedPledges.length === safetyPledges.length;
  const currentQuestion = herQuestCards[questionIndex % herQuestCards.length];

  useEffect(() => {
    if (!gameStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameStarted(false);
          setBestScore((currentBest) => Math.max(currentBest, score));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, score, timeLeft]);

  const startGame = () => {
    setScore(0);
    setQuestionIndex(0);
    setTimeLeft(30);
    setGameStarted(true);
  };

  const handleAnswer = (answerIndex) => {
    if (!gameStarted) return;

    const isCorrect = answerIndex === currentQuestion.answer;
    const nextScore = isCorrect ? score + 10 : score;
    const nextQuestionIndex = questionIndex + 1;

    setScore(nextScore);
    setBestScore((currentBest) => Math.max(currentBest, nextScore));

    if (nextQuestionIndex >= herQuestCards.length) {
      setGameStarted(false);
      setQuestionIndex(0);
      setTimeLeft(30);
      return;
    }

    setQuestionIndex(nextQuestionIndex);
  };

  const togglePledge = (pledge) => {
    setAcceptedPledges((prev) => {
      if (prev.includes(pledge)) {
        return prev.filter((item) => item !== pledge);
      }
      return [...prev, pledge];
    });
  };

  if (screen === "auth") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient colors={["#FCE7D5", "#F7EFE7", "#E8F2EC"]} style={styles.background}>
          <View style={styles.authWrapper}>
            <View style={styles.heroCard}>
              <Text style={styles.kicker}>HerSpace Welcome</Text>
              <Text style={styles.heroTitle}>Create Your Safe Account</Text>
              <Text style={styles.heroSubtitle}>
                Join a trusted women-first support ecosystem built for guidance, community, and emotional safety.
              </Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Start with identity + trust</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="First name"
                style={styles.input}
                placeholderTextColor="#7C8F88"
              />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor="#7C8F88"
              />
              <Pressable
                style={[styles.primaryButton, !(name.trim() && email.trim()) && styles.disabledButton]}
                onPress={() => {
                  if (!(name.trim() && email.trim())) return;
                  setScreen("onboarding");
                }}
              >
                <Text style={styles.primaryButtonText}>Continue to Safety Onboarding</Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (screen === "onboarding") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient colors={["#FCE7D5", "#F7EFE7", "#E8F2EC"]} style={styles.background}>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.heroCard}>
              <Text style={styles.kicker}>Safety Onboarding</Text>
              <Text style={styles.heroTitle}>Hi {name.trim() || "there"}</Text>
              <Text style={styles.heroSubtitle}>
                Pick your current life stage and confirm our emotional safety promises to unlock your dashboard.
              </Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Choose your current life stage</Text>
              <View style={styles.stageGrid}>
                {lifeStages.map((stage) => {
                  const isActive = selectedStage === stage.id;
                  return (
                    <Pressable
                      key={stage.id}
                      onPress={() => setSelectedStage(stage.id)}
                      style={[styles.stageButton, isActive && styles.stageButtonActive]}
                    >
                      <Text style={[styles.stageLabel, isActive && styles.stageLabelActive]}>{stage.stage}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.formTitle}>Community safety pledges</Text>
              {safetyPledges.map((pledge) => {
                const checked = acceptedPledges.includes(pledge);
                return (
                  <Pressable key={pledge} style={styles.pledgeRow} onPress={() => togglePledge(pledge)}>
                    <MaterialIcons
                      name={checked ? "check-box" : "check-box-outline-blank"}
                      size={20}
                      color={checked ? "#0E6B55" : "#67867C"}
                    />
                    <Text style={styles.pledgeText}>{pledge}</Text>
                  </Pressable>
                );
              })}

              <Pressable
                style={[styles.primaryButton, !acceptedAllPledges && styles.disabledButton]}
                onPress={() => {
                  if (!acceptedAllPledges) return;
                  setScreen("app");
                }}
              >
                <Text style={styles.primaryButtonText}>Enter HerSpace</Text>
              </Pressable>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={["#FCE7D5", "#F7EFE7", "#E8F2EC"]} style={styles.background}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.heroCard}>
            <Text style={styles.kicker}>Made by women, for women</Text>
            <Text style={styles.heroTitle}>HerSpace</Text>
            <Text style={styles.heroSubtitle}>
              One digital ecosystem for trusted guidance, emotional safety, and real-life support at every stage.
            </Text>
            <Text style={styles.userContext}>
              Signed in as {name || "Member"} • {selectedStageLabel}
            </Text>
            <View style={styles.pillRow}>
              <View style={styles.pill}>
                <MaterialIcons name="shield" size={14} color="#0A4B3A" />
                <Text style={styles.pillText}>Safe by design</Text>
              </View>
              <View style={styles.pill}>
                <MaterialIcons name="verified" size={14} color="#0A4B3A" />
                <Text style={styles.pillText}>Trusted experts</Text>
              </View>
            </View>
          </View>

          <View style={styles.tabContainer}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tabButton, isActive && styles.tabButtonActive]}
                  onPress={() => setActiveTab(tab.key)}
                >
                  <MaterialIcons
                    name={tab.icon}
                    size={18}
                    color={isActive ? "#FFFFFF" : "#1E3A34"}
                  />
                  <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>{sectionTitle}</Text>

          {activeTab === "home" && (
            <View style={styles.stack}>
              {lifeStages.map((item) => (
                <View key={item.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{item.stage}</Text>
                  <Text style={styles.cardBody}>{item.support}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === "advice" && (
            <View style={styles.stack}>
              {trustedAdvice.map((item) => (
                <View key={item.id} style={styles.cardAlt}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardBody}>{item.summary}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === "circles" && (
            <View style={styles.stack}>
              {communityMoments.map((item) => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.rowHeader}>
                    <Text style={styles.cardTitle}>{item.label}</Text>
                    <Text style={styles.members}>{item.members}</Text>
                  </View>
                  <Text style={styles.cardBody}>{item.mood}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === "game" && (
            <View style={styles.gameCard}>
              <View style={styles.gameHeaderRow}>
                <View>
                  <Text style={styles.gameKicker}>HerQuest</Text>
                  <Text style={styles.gameTitle}>Safe Space Challenge</Text>
                </View>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreValue}>{score}</Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>Time: {timeLeft}s</Text>
                <Text style={styles.metaText}>Best: {bestScore}</Text>
              </View>

              {!gameStarted ? (
                <View style={styles.gameBody}>
                  <Text style={styles.gamePrompt}>
                    Build healthy boundaries, protect your peace, and answer each support challenge correctly.
                  </Text>
                  <Pressable style={styles.primaryButton} onPress={startGame}>
                    <Text style={styles.primaryButtonText}>Start Game</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.gameBody}>
                  <Text style={styles.levelLabel}>Round {questionIndex + 1}</Text>
                  <Text style={styles.gamePrompt}>{currentQuestion.prompt}</Text>

                  {currentQuestion.options.map((option, optionIndex) => (
                    <Pressable
                      key={option}
                      style={styles.answerButton}
                      onPress={() => handleAnswer(optionIndex)}
                    >
                      <Text style={styles.answerText}>{option}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7EFE7",
  },
  background: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    gap: 18,
  },
  authWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 18,
  },
  heroCard: {
    marginTop: 14,
    backgroundColor: "#1E3A34",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 6,
  },
  kicker: {
    color: "#AEE8D7",
    fontSize: 12,
    letterSpacing: 0.7,
    marginBottom: 6,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  heroTitle: {
    fontSize: 34,
    color: "#FFFFFF",
    fontWeight: "800",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#DDF5EE",
    lineHeight: 21,
  },
  userContext: {
    color: "#AEE8D7",
    marginTop: 10,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E9DDD1",
    padding: 16,
    gap: 12,
  },
  formTitle: {
    color: "#12332C",
    fontSize: 15,
    fontWeight: "700",
  },
  input: {
    backgroundColor: "#F4F8F6",
    borderColor: "#D7E5DF",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    color: "#12332C",
  },
  primaryButton: {
    backgroundColor: "#0E6B55",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.45,
  },
  stageGrid: {
    gap: 8,
  },
  stageButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D7E5DF",
    backgroundColor: "#F4F8F6",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  stageButtonActive: {
    backgroundColor: "#DDF4EB",
    borderColor: "#6BB89D",
  },
  stageLabel: {
    color: "#355A52",
    fontSize: 13,
    fontWeight: "600",
  },
  stageLabelActive: {
    color: "#0D5A46",
  },
  pledgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pledgeText: {
    flex: 1,
    color: "#355A52",
    fontSize: 13,
    lineHeight: 18,
  },
  pillRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECF6F2",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 6,
  },
  pillText: {
    color: "#0A4B3A",
    fontSize: 12,
    fontWeight: "700",
  },
  tabContainer: {
    flexDirection: "row",
    gap: 10,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F4E5D7",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tabButtonActive: {
    backgroundColor: "#0E6B55",
  },
  tabLabel: {
    color: "#1E3A34",
    fontWeight: "700",
    fontSize: 13,
  },
  tabLabelActive: {
    color: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#173630",
    marginTop: 8,
  },
  stack: {
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E9DDD1",
  },
  cardAlt: {
    backgroundColor: "#ECF7F2",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#CCE8DD",
  },
  gameCard: {
    backgroundColor: "#12332C",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1D504A",
  },
  gameHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  gameKicker: {
    color: "#AEE8D7",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  gameTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },
  scoreBadge: {
    backgroundColor: "#E7F5EF",
    borderRadius: 999,
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreValue: {
    color: "#0E6B55",
    fontSize: 24,
    fontWeight: "800",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  metaText: {
    color: "#DDF5EE",
    fontSize: 12,
    fontWeight: "700",
  },
  gameBody: {
    gap: 12,
  },
  gamePrompt: {
    color: "#F5FFFB",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },
  levelLabel: {
    color: "#AEE8D7",
    fontSize: 12,
    letterSpacing: 0.9,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  answerButton: {
    backgroundColor: "#F2F9F5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DFF1EA",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  answerText: {
    color: "#12332C",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  cardTitle: {
    color: "#12332C",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },
  cardBody: {
    color: "#355A52",
    fontSize: 14,
    lineHeight: 20,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  members: {
    fontSize: 12,
    color: "#4C736A",
    fontWeight: "600",
  },
});
