// ===========================
// Configuration & Constants
// ===========================
const CONFIG = {
  GEMINI_API_KEY:
    localStorage.getItem("gemini_api_key") ||
    "AIzaSyBtqXt_tpiGSPB2LFLqIfsU5lwqDtSY3dA",
  GEMINI_API_URL:
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
  REAL_TIME_UPDATE_INTERVAL: 3000,
};

// ===========================
// State Management
// ===========================
const state = {
  currentSection: "dashboard",
  theme: localStorage.getItem("theme") || "light",
  campaigns: JSON.parse(localStorage.getItem("campaigns")) || [],
  metrics: {
    impressions: 245678,
    clicks: 18234,
    ctr: 7.42,
    activeCampaigns: 12,
  },
  chatHistory: [],
  currentCampaignData: null,
  realTimeData: {
    hourlyImpressions: [],
    hourlyClicks: [],
    hourlyEngagement: [],
  },
};

// ===========================
// Initialization
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
  setupEventListeners();
  startRealTimeUpdates();
  initializeCharts();
  checkAPIKey();
  generateRealisticData();
});

function initializeApp() {
  document.body.setAttribute("data-theme", state.theme);
  updateThemeIcon();
  updateDashboardMetrics();
  loadActivityFeed();
  loadNotifications();
  loadTrends();
  loadHistory();
  showToast("Welcome to CreativeSync AI", "All systems operational", "success");
}

function generateRealisticData() {
  // Generate 24 hours of data
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now - i * 3600000);
    state.realTimeData.hourlyImpressions.push({
      time: hour.getHours() + ":00",
      value: Math.floor(Math.random() * 5000 + 8000),
    });
    state.realTimeData.hourlyClicks.push({
      time: hour.getHours() + ":00",
      value: Math.floor(Math.random() * 400 + 500),
    });
    state.realTimeData.hourlyEngagement.push({
      time: hour.getHours() + ":00",
      value: (Math.random() * 3 + 5).toFixed(2),
    });
  }
}

// ===========================
// API Key Management
// ===========================
function checkAPIKey() {
  const savedKey = localStorage.getItem("gemini_api_key");
  if (savedKey) {
    CONFIG.GEMINI_API_KEY = savedKey;
    return;
  }

  if (CONFIG.GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    setTimeout(() => {
      document.getElementById("apiKeyModal").style.display = "flex";
    }, 1000);
  }
}

document.getElementById("saveApiKey").addEventListener("click", () => {
  const apiKey = document.getElementById("apiKeyInput").value.trim();
  if (apiKey && apiKey.length > 20) {
    CONFIG.GEMINI_API_KEY = apiKey;
    localStorage.setItem("gemini_api_key", apiKey);
    document.getElementById("apiKeyModal").style.display = "none";
    showToast("API Key Saved", "AI features are now fully enabled", "success");
  } else {
    showToast(
      "Invalid API Key",
      "Please enter a valid Gemini API key",
      "error"
    );
  }
});

document.getElementById("skipApiKey").addEventListener("click", () => {
  document.getElementById("apiKeyModal").style.display = "none";
  showToast(
    "Demo Mode Active",
    "Using simulated AI responses. Add API key for full functionality.",
    "warning"
  );
});

// ===========================
// Event Listeners Setup
// ===========================
function setupEventListeners() {
  // Navigation
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      const section = e.currentTarget.dataset.section;
      handleNavigation(section);
    });
  });

  // Theme toggle
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);

  // Notifications
  document
    .getElementById("notificationBtn")
    .addEventListener("click", toggleNotifications);
  document
    .getElementById("closeNotifications")
    .addEventListener("click", toggleNotifications);

  // Create campaign
  document
    .getElementById("generateBtn")
    .addEventListener("click", generateCampaign);
  document
    .getElementById("voiceInputBtn")
    .addEventListener("click", startVoiceInput);

  // Multi-variants
  document
    .getElementById("generateVariantsBtn")
    .addEventListener("click", generateVariants);

  // Analytics export
  document
    .getElementById("exportJSON")
    .addEventListener("click", () => exportData("json"));
  document
    .getElementById("exportCSV")
    .addEventListener("click", () => exportData("csv"));

  // Chat
  document
    .getElementById("chatSendBtn")
    .addEventListener("click", sendChatMessage);
  document.getElementById("chatInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  });
  document.getElementById("clearChatBtn").addEventListener("click", clearChat);

  // Search history
  const searchInput = document.getElementById("searchHistory");
  if (searchInput) {
    searchInput.addEventListener("input", filterHistory);
  }
}

// ===========================
// Navigation
// ===========================
function handleNavigation(section) {
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.classList.remove("active");
  });
  document.querySelector(`[data-section="${section}"]`).classList.add("active");

  document.querySelectorAll(".section").forEach((sec) => {
    sec.classList.remove("active");
  });
  document.getElementById(section).classList.add("active");

  state.currentSection = section;

  if (section === "analytics") {
    updateAnalyticsCharts();
  } else if (section === "trends") {
    loadTrends();
  }
}

// ===========================
// Theme Management
// ===========================
function toggleTheme() {
  state.theme = state.theme === "light" ? "dark" : "light";
  document.body.setAttribute("data-theme", state.theme);
  localStorage.setItem("theme", state.theme);
  updateThemeIcon();

  // Recreate charts with new theme
  Object.values(charts).forEach((chart) => chart.destroy());
  charts = {};
  initializeCharts();
  if (state.currentSection === "analytics") {
    updateAnalyticsCharts();
  }
}

function updateThemeIcon() {
  const icon = document.querySelector("#themeToggle i");
  icon.className = state.theme === "light" ? "fas fa-moon" : "fas fa-sun";
}

// ===========================
// Real-Time Updates
// ===========================
function startRealTimeUpdates() {
  setInterval(() => {
    updateDashboardMetrics();
    addRandomActivity();
    updateRealtimeCharts();
  }, CONFIG.REAL_TIME_UPDATE_INTERVAL);
}

function updateDashboardMetrics() {
  state.metrics.impressions += Math.floor(Math.random() * 800 + 200);
  state.metrics.clicks += Math.floor(Math.random() * 50 + 10);
  state.metrics.ctr = (
    (state.metrics.clicks / state.metrics.impressions) *
    100
  ).toFixed(2);

  animateCounter("totalImpressions", state.metrics.impressions);
  animateCounter("totalClicks", state.metrics.clicks);
  animateCounter("avgCTR", state.metrics.ctr, "%");
  animateCounter("activeCampaigns", state.metrics.activeCampaigns);
}

function animateCounter(elementId, endValue, suffix = "") {
  const element = document.getElementById(elementId);
  if (!element) return;

  const startValue =
    parseFloat(element.textContent.replace(/[^0-9.]/g, "")) || 0;
  const duration = 1000;
  const steps = 20;
  const increment = (endValue - startValue) / steps;
  let current = startValue;
  let step = 0;

  const timer = setInterval(() => {
    current += increment;
    step++;

    if (suffix === "%") {
      element.textContent = current.toFixed(2) + suffix;
    } else {
      element.textContent = Math.round(current).toLocaleString() + suffix;
    }

    if (step >= steps) {
      clearInterval(timer);
      if (suffix === "%") {
        element.textContent = parseFloat(endValue).toFixed(2) + suffix;
      } else {
        element.textContent = Math.round(endValue).toLocaleString() + suffix;
      }
    }
  }, duration / steps);
}

function updateRealtimeCharts() {
  // Add new data point
  const newImpression = Math.floor(Math.random() * 5000 + 8000);
  const newClick = Math.floor(Math.random() * 400 + 500);
  const newEngagement = (Math.random() * 3 + 5).toFixed(2);

  state.realTimeData.hourlyImpressions.shift();
  state.realTimeData.hourlyImpressions.push({
    time: new Date().getHours() + ":00",
    value: newImpression,
  });

  state.realTimeData.hourlyClicks.shift();
  state.realTimeData.hourlyClicks.push({
    time: new Date().getHours() + ":00",
    value: newClick,
  });

  // Update charts
  if (charts.performance) {
    charts.performance.data.labels = state.realTimeData.hourlyImpressions
      .slice(-7)
      .map((d) => d.time);
    charts.performance.data.datasets[0].data =
      state.realTimeData.hourlyImpressions.slice(-7).map((d) => d.value);
    charts.performance.data.datasets[1].data = state.realTimeData.hourlyClicks
      .slice(-7)
      .map((d) => d.value);
    charts.performance.update("none");
  }
}

// ===========================
// Activity Feed
// ===========================
function loadActivityFeed() {
  const activities = [
    {
      icon: "fas fa-rocket",
      color: "#3b82f6",
      title: "Campaign Launched",
      desc: "Summer Sale 2024 is now live",
      time: "2 minutes ago",
    },
    {
      icon: "fas fa-chart-line",
      color: "#10b981",
      title: "Performance Milestone",
      desc: "CTR increased by 15%",
      time: "15 minutes ago",
    },
    {
      icon: "fas fa-bell",
      color: "#f59e0b",
      title: "Trend Alert",
      desc: "New cultural moment detected",
      time: "1 hour ago",
    },
    {
      icon: "fas fa-check-circle",
      color: "#8b5cf6",
      title: "Compliance Check",
      desc: "All campaigns passed validation",
      time: "2 hours ago",
    },
    {
      icon: "fas fa-users",
      color: "#ef4444",
      title: "Audience Insight",
      desc: "Premium shoppers engagement up 23%",
      time: "3 hours ago",
    },
  ];

  const feed = document.getElementById("activityFeed");
  if (!feed) return;

  feed.innerHTML = activities
    .map(
      (activity) => `
        <div class="activity-item">
            <div class="activity-icon" style="background: ${activity.color}20; color: ${activity.color}">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p>${activity.desc}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
        </div>
    `
    )
    .join("");
}

function addRandomActivity() {
  const activities = [
    {
      icon: "fas fa-eye",
      color: "#3b82f6",
      title: "New Impressions",
      desc: "+500 impressions in the last 3 seconds",
    },
    {
      icon: "fas fa-mouse-pointer",
      color: "#10b981",
      title: "Clicks Recorded",
      desc: "+25 clicks from your campaigns",
    },
    {
      icon: "fas fa-fire",
      color: "#ef4444",
      title: "Trending Up",
      desc: "Your campaign is gaining momentum",
    },
  ];

  if (Math.random() > 0.6) {
    const activity = activities[Math.floor(Math.random() * activities.length)];
    const feed = document.getElementById("activityFeed");
    if (!feed) return;

    const newActivity = document.createElement("div");
    newActivity.className = "activity-item";
    newActivity.style.opacity = "0";
    newActivity.innerHTML = `
            <div class="activity-icon" style="background: ${activity.color}20; color: ${activity.color}">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p>${activity.desc}</p>
                <span class="activity-time">Just now</span>
            </div>
        `;
    feed.insertBefore(newActivity, feed.firstChild);

    setTimeout(() => (newActivity.style.opacity = "1"), 10);

    if (feed.children.length > 10) {
      feed.removeChild(feed.lastChild);
    }
  }
}

// ===========================
// Voice Input
// ===========================
function startVoiceInput() {
  if (
    !("webkitSpeechRecognition" in window) &&
    !("SpeechRecognition" in window)
  ) {
    showToast(
      "Not Supported",
      "Voice input is not supported in your browser. Please use Chrome or Edge.",
      "error"
    );
    return;
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  const voiceStatus = document.getElementById("voiceStatus");
  const productBrief = document.getElementById("productBrief");

  recognition.onstart = () => {
    voiceStatus.style.display = "flex";
    document.getElementById("voiceInputBtn").style.background =
      "linear-gradient(135deg, #ef4444, #dc2626)";
    showToast("Listening", "Speak your product brief now...", "info");
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    productBrief.value = transcript;
    voiceStatus.style.display = "none";
    document.getElementById("voiceInputBtn").style.background = "";
    showToast(
      "Voice Captured",
      "Your brief has been transcribed successfully",
      "success"
    );
  };

  recognition.onerror = (event) => {
    voiceStatus.style.display = "none";
    document.getElementById("voiceInputBtn").style.background = "";
    showToast(
      "Error",
      `Voice recognition error: ${event.error}. Please try again.`,
      "error"
    );
  };

  recognition.onend = () => {
    voiceStatus.style.display = "none";
    document.getElementById("voiceInputBtn").style.background = "";
  };

  try {
    recognition.start();
  } catch (error) {
    showToast(
      "Error",
      "Could not start voice recognition. Please try again.",
      "error"
    );
  }
}

// ===========================
// Campaign Generation with Gemini AI
// ===========================
async function generateCampaign() {
  const campaignName = document.getElementById("campaignName").value.trim();
  const productBrief = document.getElementById("productBrief").value.trim();
  const targetAudience = document.getElementById("targetAudience").value;
  const campaignType = document.getElementById("campaignType").value;
  const tone = document.getElementById("tone").value;
  const platform = document.getElementById("platform").value;

  if (!productBrief) {
    showToast(
      "Missing Information",
      "Please provide a product brief to generate a campaign",
      "warning"
    );
    document.getElementById("productBrief").focus();
    return;
  }

  if (!campaignName) {
    document.getElementById("campaignName").value = `Campaign ${Date.now()}`;
  }

  showLoading(true);

  try {
    const prompt = `You are a professional advertising copywriter. Create a compelling advertising campaign with these details:

Campaign Name: ${campaignName || "New Campaign"}
Product/Service: ${productBrief}
Target Audience: ${targetAudience}
Campaign Type: ${campaignType}
Tone: ${tone}
Platform: ${platform}

Generate a complete campaign including:

1. **Headline**: Create a catchy, attention-grabbing headline (max 12 words)
2. **Subheadline**: A compelling subheadline that supports the main headline (max 20 words)
3. **Main Copy**: 2-3 paragraphs of engaging, persuasive copy that highlights benefits and creates urgency
4. **Call-to-Action**: A strong, action-oriented CTA (1 sentence)
5. **Key Benefits**: List 4 specific benefits as bullet points
6. **Hashtags**: 5 relevant, trending hashtags
7. **Visual Suggestions**: Brief description of ideal imagery/graphics

Format the response clearly with markdown-style headers. Make it professional, compliant with advertising standards, and optimized for high engagement.`;

    const content = await callGeminiAPI(prompt);

    if (content) {
      displayGeneratedContent(
        campaignName || `Campaign ${Date.now()}`,
        content,
        {
          productBrief,
          targetAudience,
          campaignType,
          tone,
          platform,
        }
      );

      generatePredictions(content, productBrief);
      showToast(
        "Campaign Generated!",
        "Your AI-powered campaign is ready",
        "success"
      );
    } else {
      throw new Error("Empty response from AI");
    }
  } catch (error) {
    console.error("Generation error:", error);
    showToast(
      "Using Demo Content",
      "API key may be invalid or quota exceeded. Showing sample campaign.",
      "warning"
    );
    displayDemoContent(
      campaignName || "New Campaign",
      productBrief,
      targetAudience,
      tone
    );
  } finally {
    showLoading(false);
  }
}

async function callGeminiAPI(prompt) {
  if (
    !CONFIG.GEMINI_API_KEY ||
    CONFIG.GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE"
  ) {
    throw new Error("API key not configured");
  }

  try {
    const response = await fetch(
      `${CONFIG.GEMINI_API_URL}?key=${CONFIG.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_NONE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE",
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API error: ${response.status} - ${
          errorData.error?.message || "Unknown error"
        }`
      );
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Invalid API response format");
    }
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}

function displayGeneratedContent(title, content, metadata = {}) {
  state.currentCampaignData = {
    title,
    content,
    metadata,
    created: new Date().toISOString(),
  };

  document.getElementById("genTitle").textContent = title;
  document.getElementById("genContent").innerHTML =
    formatGeneratedContent(content);
  document.getElementById("generatedContent").style.display = "block";

  // Add event listeners for actions
  const saveBtn = document.getElementById("saveBtn");
  const exportBtn = document.getElementById("exportBtn");
  const editBtn = document.getElementById("editBtn");

  if (saveBtn) {
    saveBtn.onclick = saveCampaign;
  }
  if (exportBtn) {
    exportBtn.onclick = exportCampaign;
  }
  if (editBtn) {
    editBtn.onclick = () => {
      showToast("Edit Mode", "Content is now editable", "info");
      const contentDiv = document.getElementById("genContent");
      contentDiv.contentEditable = true;
      contentDiv.style.border = "2px dashed var(--primary)";
      contentDiv.focus();
    };
  }

  setTimeout(() => {
    document.getElementById("generatedContent").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
}

function displayDemoContent(title, brief, audience, tone) {
  const demoContent = `
## 🎯 Headline
**Transform Your Shopping Experience with Exclusive Member Benefits**

## 📢 Subheadline
Unlock premium savings and personalized offers designed just for ${audience} shoppers

## 📝 Main Copy

${brief}

Our exclusive ${tone.toLowerCase()} approach ensures you get the best value for your money. With personalized recommendations powered by Clubcard data, every shopping trip becomes an opportunity to save more and discover products you'll love.

Join thousands of satisfied customers who've already transformed their shopping experience. Our intelligent system learns your preferences and delivers tailored offers that match your lifestyle perfectly.

## 🎬 Call-to-Action
**Shop Now and Save Up to 50% - Limited Time Exclusive Offer!**

## ✨ Key Benefits
• **Personalized Discounts**: Up to 50% off on your favorite products
• **Smart Recommendations**: AI-powered suggestions based on your shopping history
• **Free Delivery**: On all orders over $50 for Clubcard members
• **Early Access**: Be the first to know about new deals and exclusive launches

## 📱 Hashtags
#SmartShopping #ExclusiveDeals #ClubcardPerks #SaveMore #PersonalizedOffers

## 🎨 Visual Suggestions
Use vibrant product photography with happy ${audience.toLowerCase()} customers. Include Clubcard branding with gradient overlays. Show clear before/after price comparisons and trust badges.
    `;

  displayGeneratedContent(title, demoContent, { brief, audience, tone });
  generatePredictions(demoContent, brief);
}

function formatGeneratedContent(content) {
  if (!content) return "<p>No content generated</p>";

  return content
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/^• (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*?<\/li>)/s, "<ul>$1</ul>")
    .replace(/<\/ul>\s*<ul>/g, "")
    .replace(/\n\n/g, "</p><p>")
    .replace(
      /^(?!<[hul]|<\/[hul]|<li>|<\/li>|<p>|<\/p>|<strong>|<em>)(.+)$/gm,
      "<p>$1</p>"
    )
    .trim();
}

function generatePredictions(content, brief) {
  // Advanced ML-style predictions based on content analysis
  const wordCount = content.split(/\s+/).length;
  const hasUrgency = /limited|now|today|hurry|exclusive/i.test(content);
  const hasBenefits = /save|free|discount|offer/i.test(content);
  const hasEmojis = /[\u{1F300}-\u{1F9FF}]/u.test(content);

  let baseCTR = 3.5;
  if (hasUrgency) baseCTR += 1.2;
  if (hasBenefits) baseCTR += 1.5;
  if (hasEmojis) baseCTR += 0.8;
  if (wordCount > 200) baseCTR += 0.5;

  const ctr = (baseCTR + Math.random() * 1.5).toFixed(2);
  const reach = Math.floor(Math.random() * 100000 + 150000);
  const engagement = Math.floor(
    hasUrgency && hasBenefits
      ? 85 + Math.random() * 10
      : 70 + Math.random() * 15
  );

  document.getElementById("predCTR").textContent = ctr + "%";
  document.getElementById("predReach").textContent = reach.toLocaleString();
  document.getElementById("predEngagement").textContent = engagement + "/100";
  document.getElementById("predCompliance").textContent = "100/100";

  // Animate the predictions
  document.querySelectorAll(".prediction-item strong").forEach((el) => {
    el.style.transform = "scale(1.1)";
    setTimeout(() => (el.style.transform = "scale(1)"), 300);
  });
}

// ===========================
// Campaign Actions
// ===========================
function saveCampaign() {
  if (!state.currentCampaignData) {
    showToast("No Campaign", "Please generate a campaign first", "warning");
    return;
  }

  const campaign = {
    id: Date.now(),
    name: state.currentCampaignData.title,
    content: state.currentCampaignData.content,
    metadata: state.currentCampaignData.metadata,
    created: state.currentCampaignData.created,
    status: "Active",
    metrics: {
      impressions: Math.floor(Math.random() * 50000 + 100000),
      clicks: Math.floor(Math.random() * 3000 + 5000),
      ctr: (Math.random() * 3 + 5).toFixed(2),
      engagement: Math.floor(Math.random() * 20 + 70),
      reach: Math.floor(Math.random() * 100000 + 150000),
    },
  };

  state.campaigns.unshift(campaign);
  localStorage.setItem("campaigns", JSON.stringify(state.campaigns));

  state.metrics.activeCampaigns = state.campaigns.filter(
    (c) => c.status === "Active"
  ).length;

  showToast(
    "Campaign Saved!",
    "Your campaign has been saved successfully",
    "success"
  );
  loadHistory();

  // Show notification
  addNotification(
    "Campaign Saved",
    `${campaign.name} is now active`,
    "success"
  );
}

function exportCampaign() {
  if (!state.currentCampaignData) {
    showToast("No Campaign", "Please generate a campaign first", "warning");
    return;
  }

  const exportData = {
    title: state.currentCampaignData.title,
    content: state.currentCampaignData.content,
    metadata: state.currentCampaignData.metadata,
    predictions: {
      ctr: document.getElementById("predCTR").textContent,
      reach: document.getElementById("predReach").textContent,
      engagement: document.getElementById("predEngagement").textContent,
      compliance: document.getElementById("predCompliance").textContent,
    },
    exported: new Date().toISOString(),
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${exportData.title.replace(/\s+/g, "-")}-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);

  showToast("Export Complete", "Campaign exported successfully", "success");
}

// ===========================
// Multi-Variant Generation
// ===========================
async function generateVariants() {
  const productBrief = document.getElementById("productBrief").value.trim();
  const campaignName = document.getElementById("campaignName").value.trim();

  if (!productBrief) {
    showToast(
      "Missing Information",
      "Please go to Create Campaign and add a product brief first",
      "warning"
    );
    handleNavigation("create");
    document.getElementById("productBrief").focus();
    return;
  }

  showLoading(true);

  const container = document.getElementById("variantsContainer");
  container.innerHTML =
    '<div style="text-align: center; padding: 2rem; color: var(--text-secondary);"><i class="fas fa-spinner fa-spin" style="font-size: 2rem;"></i><p>Generating 3 unique variants...</p></div>';

  const tones = [
    "Professional & Authoritative",
    "Friendly & Conversational",
    "Urgent & Action-Oriented",
  ];
  const variants = [];

  try {
    for (let i = 0; i < 3; i++) {
      const variant = await generateSingleVariant(
        productBrief,
        tones[i],
        i + 1,
        campaignName
      );
      variants.push(variant);

      if (i === 0) {
        container.innerHTML = "";
      }
      displayVariant(container, variant, i + 1, tones[i]);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    showToast(
      "Variants Ready!",
      "3 A/B test versions generated successfully",
      "success"
    );
  } catch (error) {
    console.error("Variant generation error:", error);
    container.innerHTML = "";
    displayDemoVariants(container, productBrief);
    showToast(
      "Demo Variants",
      "Showing sample variants. Add API key for AI-generated versions.",
      "info"
    );
  } finally {
    showLoading(false);
  }
}

async function generateSingleVariant(brief, tone, variantNum, campaignName) {
  const prompt = `Create advertising copy variant ${variantNum} with a ${tone} tone.

Product/Service: ${brief}
Campaign: ${campaignName || "New Campaign"}

Generate ONLY:
1. A compelling headline (8-10 words)
2. Two sentences of persuasive copy
3. One strong call-to-action

Keep it concise and optimized for ${tone} style. Make each variant distinctly different.`;

  try {
    const content = await callGeminiAPI(prompt);
    return {
      content: content.trim(),
      tone: tone,
      ctr: (Math.random() * 2 + 5).toFixed(2),
      engagement: Math.floor(Math.random() * 10 + 80),
      reach: Math.floor(Math.random() * 50000 + 100000),
      confidence: Math.floor(Math.random() * 10 + 85),
    };
  } catch {
    return {
      content: `${tone} approach:\n\n${brief.substring(
        0,
        120
      )}...\n\nDiscover amazing benefits today! Act now and transform your experience.`,
      tone: tone,
      ctr: (Math.random() * 2 + 5).toFixed(2),
      engagement: Math.floor(Math.random() * 10 + 80),
      reach: Math.floor(Math.random() * 50000 + 100000),
      confidence: Math.floor(Math.random() * 10 + 85),
    };
  }
}

function displayVariant(container, variant, num, tone) {
  const variantCard = document.createElement("div");
  variantCard.className = "variant-card";
  variantCard.style.opacity = "0";
  variantCard.style.transform = "translateY(20px)";

  const colors = ["#6366f1", "#10b981", "#f59e0b"];

  variantCard.innerHTML = `
        <div class="variant-header">
            <h3>Variant ${num}</h3>
            <span class="variant-label" style="background: ${
              colors[num - 1]
            };">Version ${String.fromCharCode(64 + num)}</span>
        </div>
        <div style="margin: 1rem 0; padding: 0.5rem 1rem; background: var(--bg-secondary); border-radius: 8px; font-size: 0.85rem; color: var(--text-secondary);">
            <strong>Tone:</strong> ${tone}
        </div>
        <div class="variant-body" style="white-space: pre-line; line-height: 1.7;">
            ${variant.content}
        </div>
        <div class="variant-stats">
            <div class="variant-stat">
                <span>Predicted CTR</span>
                <strong style="color: ${colors[num - 1]};">${
    variant.ctr
  }%</strong>
            </div>
            <div class="variant-stat">
                <span>Engagement</span>
                <strong style="color: ${colors[num - 1]};">${
    variant.engagement
  }/100</strong>
            </div>
            <div class="variant-stat">
                <span>Est. Reach</span>
                <strong style="color: ${
                  colors[num - 1]
                };">${variant.reach.toLocaleString()}</strong>
            </div>
        </div>
        <div style="margin-top: 1rem; padding: 0.75rem; background: ${
          colors[num - 1]
        }15; border-radius: 8px; text-align: center;">
            <span style="font-size: 0.85rem; color: var(--text-secondary);">AI Confidence Score:</span>
            <strong style="color: ${
              colors[num - 1]
            }; font-size: 1.1rem; margin-left: 0.5rem;">${
    variant.confidence
  }%</strong>
        </div>
        <button class="btn-primary" style="width: 100%; margin-top: 1rem; background: linear-gradient(135deg, ${
          colors[num - 1]
        }, ${colors[num - 1]}dd);" onclick="selectVariant(${num})">
            <i class="fas fa-check-circle"></i>
            Select This Variant
        </button>
    `;
  container.appendChild(variantCard);

  setTimeout(() => {
    variantCard.style.transition = "all 0.5s ease";
    variantCard.style.opacity = "1";
    variantCard.style.transform = "translateY(0)";
  }, 50);
}

function selectVariant(num) {
  showToast(
    "Variant Selected",
    `Variant ${num} is now your active campaign version`,
    "success"
  );
  addNotification(
    "Variant Selected",
    `Variant ${num} activated for your campaign`,
    "info"
  );
}

function displayDemoVariants(container, brief) {
  const variants = [
    {
      content: `Professional Excellence Awaits\n\n${brief.substring(
        0,
        100
      )}... Our data-driven approach ensures optimal results. Experience the difference that expertise makes.\n\nGet Started with Confidence Today`,
      tone: "Professional & Authoritative",
      ctr: "6.8",
      engagement: 87,
      reach: 125000,
      confidence: 92,
    },
    {
      content: `Hey! We've Got Something Special 🎉\n\n${brief.substring(
        0,
        90
      )}... We're here to make your life easier and more enjoyable. Join our community of happy customers!\n\nLet's Make It Happen Together!`,
      tone: "Friendly & Conversational",
      ctr: "7.2",
      engagement: 91,
      reach: 145000,
      confidence: 89,
    },
    {
      content: `⚡ Limited Time Offer - Act Now!\n\n${brief.substring(
        0,
        95
      )}... Don't miss out on this exclusive opportunity. Time is running out!\n\n🔥 Claim Your Offer Before It's Gone!`,
      tone: "Urgent & Action-Oriented",
      ctr: "8.1",
      engagement: 94,
      reach: 165000,
      confidence: 95,
    },
  ];

  variants.forEach((variant, i) =>
    displayVariant(container, variant, i + 1, variant.tone)
  );
}

window.selectVariant = selectVariant;

// ===========================
// Charts Initialization
// ===========================
let charts = {};

function getChartTheme() {
  return {
    gridColor: state.theme === "dark" ? "#334155" : "#e2e8f0",
    textColor: state.theme === "dark" ? "#cbd5e1" : "#475569",
    tooltipBg: state.theme === "dark" ? "#1e293b" : "#ffffff",
  };
}

function initializeCharts() {
  const theme = getChartTheme();

  // Performance Chart
  const perfCtx = document.getElementById("performanceChart")?.getContext("2d");
  if (perfCtx) {
    charts.performance = new Chart(perfCtx, {
      type: "line",
      data: {
        labels: state.realTimeData.hourlyImpressions
          .slice(-7)
          .map((d) => d.time),
        datasets: [
          {
            label: "Impressions",
            data: state.realTimeData.hourlyImpressions
              .slice(-7)
              .map((d) => d.value),
            borderColor: "#6366f1",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: "Clicks",
            data: state.realTimeData.hourlyClicks.slice(-7).map((d) => d.value),
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          intersect: false,
          mode: "index",
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: theme.textColor,
              usePointStyle: true,
              padding: 15,
            },
          },
          tooltip: {
            backgroundColor: theme.tooltipBg,
            titleColor: theme.textColor,
            bodyColor: theme.textColor,
            borderColor: theme.gridColor,
            borderWidth: 1,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: theme.gridColor,
            },
            ticks: {
              color: theme.textColor,
            },
          },
          x: {
            grid: {
              color: theme.gridColor,
            },
            ticks: {
              color: theme.textColor,
            },
          },
        },
      },
    });
  }

  // CTR Chart
  const ctrCtx = document.getElementById("ctrChart")?.getContext("2d");
  if (ctrCtx) {
    charts.ctr = new Chart(ctrCtx, {
      type: "bar",
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
          {
            label: "CTR %",
            data: [5.2, 6.1, 7.3, 7.8],
            backgroundColor: [
              "rgba(99, 102, 241, 0.8)",
              "rgba(139, 92, 246, 0.8)",
              "rgba(16, 185, 129, 0.8)",
              "rgba(245, 158, 11, 0.8)",
            ],
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: theme.tooltipBg,
            titleColor: theme.textColor,
            bodyColor: theme.textColor,
            borderColor: theme.gridColor,
            borderWidth: 1,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
            grid: {
              color: theme.gridColor,
            },
            ticks: {
              color: theme.textColor,
              callback: function (value) {
                return value + "%";
              },
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: theme.textColor,
            },
          },
        },
      },
    });
  }
}

function updateAnalyticsCharts() {
  const theme = getChartTheme();

  // Comparison Chart
  const compCtx = document.getElementById("comparisonChart")?.getContext("2d");
  if (compCtx && !charts.comparison) {
    charts.comparison = new Chart(compCtx, {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
        ],
        datasets: [
          {
            label: "Summer Sale Campaign",
            data: [4.2, 5.1, 6.3, 5.8, 7.2, 8.1, 8.5, 7.9, 7.3, 6.8, 7.5],
            borderColor: "#6366f1",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Holiday Promo",
            data: [3.8, 4.5, 5.2, 6.1, 6.8, 7.5, 7.2, 7.8, 8.3, 8.9, 9.2],
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Black Friday Prep",
            data: [5.1, 5.8, 6.2, 6.9, 7.5, 8.3, 8.7, 9.1, 9.5, 10.2, 11.3],
            borderColor: "#8b5cf6",
            backgroundColor: "rgba(139, 92, 246, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          intersect: false,
          mode: "index",
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: theme.textColor,
              usePointStyle: true,
              padding: 15,
            },
          },
          tooltip: {
            backgroundColor: theme.tooltipBg,
            titleColor: theme.textColor,
            bodyColor: theme.textColor,
            borderColor: theme.gridColor,
            borderWidth: 1,
            callbacks: {
              label: function (context) {
                return (
                  context.dataset.label + ": " + context.parsed.y + "% CTR"
                );
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: theme.gridColor,
            },
            ticks: {
              color: theme.textColor,
              callback: function (value) {
                return value + "%";
              },
            },
          },
          x: {
            grid: {
              color: theme.gridColor,
            },
            ticks: {
              color: theme.textColor,
            },
          },
        },
      },
    });
  }

  // Audience Chart
  const audCtx = document.getElementById("audienceChart")?.getContext("2d");
  if (audCtx && !charts.audience) {
    charts.audience = new Chart(audCtx, {
      type: "doughnut",
      data: {
        labels: [
          "Young Families",
          "Premium Shoppers",
          "Budget Conscious",
          "Health Focused",
          "Others",
        ],
        datasets: [
          {
            data: [32, 28, 18, 14, 8],
            backgroundColor: [
              "#6366f1",
              "#10b981",
              "#f59e0b",
              "#8b5cf6",
              "#ef4444",
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: theme.textColor,
              usePointStyle: true,
              padding: 15,
            },
          },
          tooltip: {
            backgroundColor: theme.tooltipBg,
            titleColor: theme.textColor,
            bodyColor: theme.textColor,
            borderColor: theme.gridColor,
            borderWidth: 1,
            callbacks: {
              label: function (context) {
                return context.label + ": " + context.parsed + "%";
              },
            },
          },
        },
      },
    });
  }

  // Funnel Chart
  const funnelCtx = document.getElementById("funnelChart")?.getContext("2d");
  if (funnelCtx && !charts.funnel) {
    charts.funnel = new Chart(funnelCtx, {
      type: "bar",
      data: {
        labels: ["Impressions", "Clicks", "Visits", "Add to Cart", "Purchase"],
        datasets: [
          {
            label: "Users",
            data: [250000, 18500, 12000, 5500, 3200],
            backgroundColor: [
              "#6366f1",
              "#8b5cf6",
              "#10b981",
              "#f59e0b",
              "#ef4444",
            ],
            borderRadius: 8,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: theme.tooltipBg,
            titleColor: theme.textColor,
            bodyColor: theme.textColor,
            borderColor: theme.gridColor,
            borderWidth: 1,
            callbacks: {
              label: function (context) {
                return context.parsed.x.toLocaleString() + " users";
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: theme.gridColor,
            },
            ticks: {
              color: theme.textColor,
              callback: function (value) {
                return value / 1000 + "K";
              },
            },
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              color: theme.textColor,
            },
          },
        },
      },
    });
  }
}

// ===========================
// Trends Detection
// ===========================
function loadTrends() {
  const currentDate = new Date();
  const month = currentDate.toLocaleString("default", { month: "long" });

  const trends = [
    {
      title: "Black Friday Shopping Surge",
      description:
        "Consumer behavior shows 234% increase in deal-seeking queries. Early bird shoppers are actively researching offers. Mobile shopping up 67%.",
      badge: "hot",
      score: 95,
      growth: "+234%",
      audience: "2.3M",
      icon: "fa-fire",
    },
    {
      title: `${month} Seasonal Preferences`,
      description:
        "Category preferences shifting towards seasonal products. Health & wellness seeing increased engagement. Sustainable products gaining traction.",
      badge: "rising",
      score: 87,
      growth: "+156%",
      audience: "1.8M",
      icon: "fa-chart-line",
    },
    {
      title: "Eco-Conscious Shopping",
      description:
        "Sustainable and eco-friendly product searches up significantly. Clubcard members prioritizing green choices. Carbon-neutral delivery preferred.",
      badge: "emerging",
      score: 78,
      growth: "+92%",
      audience: "1.2M",
      icon: "fa-leaf",
    },
    {
      title: "Mobile-First Commerce",
      description:
        "Mobile transactions increased 67% this week. App-based shopping overtaking desktop. One-click checkout driving conversions.",
      badge: "hot",
      score: 91,
      growth: "+67%",
      audience: "2.1M",
      icon: "fa-mobile-alt",
    },
    {
      title: "Premium Product Demand",
      description:
        "Clubcard Plus members showing 45% higher engagement with premium offerings. Quality over quantity trend growing.",
      badge: "rising",
      score: 82,
      growth: "+45%",
      audience: "950K",
      icon: "fa-crown",
    },
    {
      title: "Social Commerce Boom",
      description:
        "Shopping via social platforms up 128%. Instagram and TikTok driving significant conversions. Influencer partnerships showing ROI.",
      badge: "emerging",
      score: 75,
      growth: "+128%",
      audience: "1.5M",
      icon: "fa-share-alt",
    },
  ];

  const container = document.getElementById("trendsContainer");
  if (!container) return;

  container.innerHTML = trends
    .map(
      (trend) => `
        <div class="trend-card">
            <div class="trend-header">
                <span class="trend-badge ${
                  trend.badge
                }">${trend.badge.toUpperCase()}</span>
                <span style="font-weight: 700; color: var(--primary); font-size: 1.1rem;">${
                  trend.score
                }/100</span>
            </div>
            <div style="text-align: center; margin: 1rem 0;">
                <i class="fas ${
                  trend.icon
                }" style="font-size: 2.5rem; color: var(--primary); opacity: 0.7;"></i>
            </div>
            <div class="trend-content">
                <h3>${trend.title}</h3>
                <p>${trend.description}</p>
            </div>
            <div class="trend-metrics">
                <div class="trend-metric">
                    <i class="fas fa-chart-line"></i>
                    <span><strong>${trend.growth}</strong> Growth</span>
                </div>
                <div class="trend-metric">
                    <i class="fas fa-users"></i>
                    <span><strong>${trend.audience}</strong> Reach</span>
                </div>
            </div>
            <button class="btn-secondary" style="width: 100%; margin-top: 1rem;" onclick="applyTrend('${
              trend.title
            }')">
                <i class="fas fa-magic"></i>
                Apply to Campaign
            </button>
        </div>
    `
    )
    .join("");
}

window.applyTrend = function (trendTitle) {
  showToast(
    "Trend Applied",
    `"${trendTitle}" insights added to your campaign strategy`,
    "success"
  );
  handleNavigation("create");
  const brief = document.getElementById("productBrief");
  if (brief.value) {
    brief.value += `\n\nTrend Insight: ${trendTitle}`;
  }
};

// ===========================
// Campaign History
// ===========================
function loadHistory() {
  const container = document.getElementById("historyContainer");
  if (!container) return;

  if (state.campaigns.length === 0) {
    container.innerHTML = `
            <div style="text-align: center; padding: 4rem; color: var(--text-secondary);">
                <i class="fas fa-folder-open" style="font-size: 4rem; margin-bottom: 1.5rem; opacity: 0.3;"></i>
                <h3 style="margin-bottom: 0.5rem;">No Campaigns Yet</h3>
                <p>Create your first AI-powered campaign to get started!</p>
                <button class="btn-primary" style="margin-top: 1.5rem;" onclick="handleNavigation('create')">
                    <i class="fas fa-plus"></i>
                    Create Campaign
                </button>
            </div>
        `;
    return;
  }

  container.innerHTML = state.campaigns
    .map((campaign) => {
      const statusColor =
        campaign.status === "Active"
          ? "var(--success)"
          : "var(--text-secondary)";
      return `
        <div class="history-item">
            <div class="history-info">
                <h3>${campaign.name}</h3>
                <p style="margin: 0.5rem 0;">
                    <span style="color: ${statusColor}; font-weight: 600;">● ${
        campaign.status
      }</span> • 
                    Created: ${new Date(campaign.created).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    )}
                </p>
                <div style="display: flex; gap: 1.5rem; margin-top: 0.75rem; font-size: 0.9rem; flex-wrap: wrap;">
                    <span style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-eye" style="color: var(--primary);"></i> 
                        <strong>${campaign.metrics.impressions.toLocaleString()}</strong>
                    </span>
                    <span style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-mouse-pointer" style="color: var(--success);"></i> 
                        <strong>${campaign.metrics.clicks.toLocaleString()}</strong>
                    </span>
                    <span style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-percentage" style="color: var(--warning);"></i> 
                        <strong>${campaign.metrics.ctr}%</strong>
                    </span>
                    <span style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-bullseye" style="color: var(--secondary);"></i> 
                        <strong>${
                          campaign.metrics.reach?.toLocaleString() || "N/A"
                        }</strong>
                    </span>
                </div>
            </div>
            <div class="history-actions">
                <button class="icon-btn" onclick="viewCampaign(${
                  campaign.id
                })" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="icon-btn" onclick="duplicateCampaign(${
                  campaign.id
                })" title="Duplicate">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="icon-btn" onclick="deleteCampaign(${
                  campaign.id
                })" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    })
    .join("");
}

function filterHistory() {
  const searchTerm = document
    .getElementById("searchHistory")
    .value.toLowerCase();
  const items = document.querySelectorAll(".history-item");

  items.forEach((item) => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(searchTerm) ? "flex" : "none";
  });
}

window.viewCampaign = function (id) {
  const campaign = state.campaigns.find((c) => c.id === id);
  if (campaign) {
    state.currentCampaignData = {
      title: campaign.name,
      content: campaign.content,
      metadata: campaign.metadata,
      created: campaign.created,
    };

    document.getElementById("genTitle").textContent = campaign.name;
    document.getElementById("genContent").innerHTML = formatGeneratedContent(
      campaign.content
    );
    document.getElementById("generatedContent").style.display = "block";

    // Update predictions with campaign metrics
    document.getElementById("predCTR").textContent = campaign.metrics.ctr + "%";
    document.getElementById("predReach").textContent =
      campaign.metrics.reach?.toLocaleString() || "N/A";
    document.getElementById("predEngagement").textContent =
      campaign.metrics.engagement + "/100";

    handleNavigation("create");
    showToast("Campaign Loaded", "Viewing campaign details", "info");
  }
};

window.duplicateCampaign = function (id) {
  const campaign = state.campaigns.find((c) => c.id === id);
  if (campaign) {
    const duplicate = {
      ...JSON.parse(JSON.stringify(campaign)),
      id: Date.now(),
      name: campaign.name + " (Copy)",
      created: new Date().toISOString(),
      metrics: {
        ...campaign.metrics,
        impressions: 0,
        clicks: 0,
        ctr: "0.00",
      },
    };
    state.campaigns.unshift(duplicate);
    localStorage.setItem("campaigns", JSON.stringify(state.campaigns));
    loadHistory();
    showToast(
      "Campaign Duplicated",
      "A copy has been created successfully",
      "success"
    );
  }
};

window.deleteCampaign = function (id) {
  if (
    confirm(
      "Are you sure you want to delete this campaign? This action cannot be undone."
    )
  ) {
    state.campaigns = state.campaigns.filter((c) => c.id !== id);
    localStorage.setItem("campaigns", JSON.stringify(state.campaigns));
    state.metrics.activeCampaigns = state.campaigns.filter(
      (c) => c.status === "Active"
    ).length;
    loadHistory();
    showToast("Campaign Deleted", "Campaign removed successfully", "success");
  }
};

// ===========================
// Chat Assistant
// ===========================
async function sendChatMessage() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();

  if (!message) return;

  addChatMessage(message, "user");
  input.value = "";
  input.focus();

  const typingId = addTypingIndicator();

  try {
    const response = await getChatResponse(message);
    removeTypingIndicator(typingId);
    addChatMessage(response, "assistant");
  } catch (error) {
    console.error("Chat error:", error);
    removeTypingIndicator(typingId);
    const fallbackResponse = getFallbackResponse(message);
    addChatMessage(fallbackResponse, "assistant");
  }
}

async function getChatResponse(message) {
  const context = `You are CreativeSync AI, an intelligent advertising assistant specializing in campaign creation, performance analysis, and trend detection. 

Current system state:
- Total campaigns: ${state.campaigns.length}
- Active campaigns: ${state.metrics.activeCampaigns}
- Total impressions: ${state.metrics.impressions.toLocaleString()}
- Average CTR: ${state.metrics.ctr}%

User question: ${message}

Provide a helpful, concise, and actionable response. Be friendly and professional. If the question is about campaigns, trends, or analytics, reference the current data above.`;

  try {
    const response = await callGeminiAPI(context);
    return response;
  } catch (error) {
    throw error;
  }
}

function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();

  // Smart keyword matching
  if (
    lowerMessage.includes("campaign") ||
    lowerMessage.includes("create") ||
    lowerMessage.includes("generate")
  ) {
    return `To create a campaign, go to the "Create Campaign" section, fill in your product brief and target details, then click "Generate Campaign with AI". I'll create compelling ad copy optimized for your audience! You currently have ${state.campaigns.length} saved campaigns.`;
  }

  if (
    lowerMessage.includes("trend") ||
    lowerMessage.includes("trending") ||
    lowerMessage.includes("popular")
  ) {
    return `Check out the "Trends" section to see real-time cultural moments and shopping behaviors! I've detected several hot trends including Black Friday prep (234% growth) and mobile commerce surge (67% increase). Would you like me to apply any trends to your next campaign?`;
  }

  if (
    lowerMessage.includes("performance") ||
    lowerMessage.includes("metric") ||
    lowerMessage.includes("analytics")
  ) {
    return `Your campaigns are performing well! Current metrics:\n• Total Impressions: ${state.metrics.impressions.toLocaleString()}\n• Total Clicks: ${state.metrics.clicks.toLocaleString()}\n• Average CTR: ${
      state.metrics.ctr
    }%\n• Active Campaigns: ${
      state.metrics.activeCampaigns
    }\n\nVisit the Analytics section for detailed insights and comparisons!`;
  }

  if (
    lowerMessage.includes("variant") ||
    lowerMessage.includes("a/b") ||
    lowerMessage.includes("test")
  ) {
    return `I can generate 3 unique campaign variants for A/B testing! Each variant uses a different tone (Professional, Friendly, Urgent) to help you find what resonates best with your audience. Go to the "Multi-Variants" section and click "Generate 3 Variants" to get started.`;
  }

  if (
    lowerMessage.includes("export") ||
    lowerMessage.includes("download") ||
    lowerMessage.includes("save")
  ) {
    return `You can export your campaigns and analytics data in JSON or CSV format. Just go to the Analytics section and click the export buttons, or use the export button on any generated campaign. All your campaigns are also automatically saved to your browser's local storage!`;
  }

  if (
    lowerMessage.includes("api") ||
    lowerMessage.includes("key") ||
    lowerMessage.includes("gemini")
  ) {
    return `To enable full AI features, you need a Gemini API key. Get one free at https://makersuite.google.com/app/apikey. Then enter it in the settings (look for the modal that appears on first launch, or refresh the page). Without an API key, you'll see demo content with simulated AI responses.`;
  }

  if (
    lowerMessage.includes("voice") ||
    lowerMessage.includes("speak") ||
    lowerMessage.includes("microphone")
  ) {
    return `Voice input is available in the Create Campaign section! Click the microphone button next to the product brief field and speak your campaign details. This feature works best in Chrome or Edge browsers. Note: Voice recognition requires microphone permissions.`;
  }

  if (
    lowerMessage.includes("help") ||
    lowerMessage.includes("how") ||
    lowerMessage.includes("what can")
  ) {
    return `I can help you with:\n\n✨ Creating AI-powered campaigns\n📊 Analyzing performance metrics\n🔥 Detecting trends and cultural moments\n🧪 Generating A/B test variants\n📈 Providing optimization recommendations\n💾 Exporting data and reports\n\nWhat would you like to work on?`;
  }

  if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
    return `You're welcome! I'm always here to help you create amazing campaigns. Let me know if you need anything else! 🚀`;
  }

  if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hey")
  ) {
    return `Hello! 👋 I'm your AI advertising assistant. I can help you create campaigns, analyze performance, detect trends, and optimize your advertising strategy. What would you like to work on today?`;
  }

  // Default response
  return `I'm here to help with campaign creation, performance analysis, trend detection, and optimization strategies. Could you rephrase your question or ask me about:\n• Creating new campaigns\n• Analyzing metrics\n• Current trends\n• Multi-variant testing\n• Export options\n\nWhat would you like to know?`;
}

function addChatMessage(text, sender) {
  const messagesContainer = document.getElementById("chatMessages");
  if (!messagesContainer) return;

  const messageDiv = document.createElement("div");
  messageDiv.className = `chat-message ${sender}`;
  messageDiv.style.opacity = "0";
  messageDiv.style.transform = "translateY(10px)";

  messageDiv.innerHTML = `
        <div class="chat-avatar">
            <i class="fas fa-${sender === "user" ? "user" : "robot"}"></i>
        </div>
        <div class="chat-bubble">${text.replace(/\n/g, "<br>")}</div>
    `;

  messagesContainer.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.style.transition = "all 0.3s ease";
    messageDiv.style.opacity = "1";
    messageDiv.style.transform = "translateY(0)";
  }, 10);

  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  state.chatHistory.push({ sender, text, timestamp: Date.now() });
}

function addTypingIndicator() {
  const messagesContainer = document.getElementById("chatMessages");
  if (!messagesContainer) return null;

  const typingDiv = document.createElement("div");
  const id = "typing-" + Date.now();
  typingDiv.id = id;
  typingDiv.className = "chat-message assistant";
  typingDiv.innerHTML = `
        <div class="chat-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="chat-bubble" style="padding: 1rem;">
            <div style="display: flex; gap: 0.5rem; align-items: center;">
                <i class="fas fa-circle" style="font-size: 0.5rem; animation: pulse 1.5s infinite;"></i>
                <i class="fas fa-circle" style="font-size: 0.5rem; animation: pulse 1.5s infinite 0.3s;"></i>
                <i class="fas fa-circle" style="font-size: 0.5rem; animation: pulse 1.5s infinite 0.6s;"></i>
            </div>
        </div>
    `;
  messagesContainer.appendChild(typingDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  return id;
}

function removeTypingIndicator(id) {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
  }
}

function clearChat() {
  if (confirm("Clear all chat messages?")) {
    const messagesContainer = document.getElementById("chatMessages");
    if (messagesContainer) {
      messagesContainer.innerHTML = "";
    }
    state.chatHistory = [];
    showToast("Chat Cleared", "All messages have been removed", "success");

    setTimeout(() => {
      addChatMessage(
        "Hello! I'm your AI assistant. How can I help you create amazing campaigns today? 🚀",
        "assistant"
      );
    }, 300);
  }
}

// ===========================
// Notifications
// ===========================
function loadNotifications() {
  const notifications = [
    {
      title: "🎉 Campaign Performance Alert",
      message:
        "Your Summer Sale campaign exceeded 10K impressions and achieved 7.2% CTR!",
      time: "5 minutes ago",
      unread: true,
      type: "success",
    },
    {
      title: "🔥 New Trend Detected",
      message:
        "Black Friday prep is trending up 234%. Consider creating urgency-focused campaigns.",
      time: "1 hour ago",
      unread: true,
      type: "info",
    },
    {
      title: "✅ Compliance Check Complete",
      message:
        "All active campaigns passed validation checks. No issues found.",
      time: "3 hours ago",
      unread: false,
      type: "success",
    },
    {
      title: "📊 Weekly Report Ready",
      message: "Your weekly performance report is available for download.",
      time: "1 day ago",
      unread: false,
      type: "info",
    },
  ];

  const container = document.getElementById("notificationsList");
  if (!container) return;

  container.innerHTML = notifications
    .map(
      (notif) => `
        <div class="notification-item ${
          notif.unread ? "unread" : ""
        }" onclick="markNotificationRead(this)">
            <h4>${notif.title}</h4>
            <p>${notif.message}</p>
            <time>${notif.time}</time>
        </div>
    `
    )
    .join("");
}

function addNotification(title, message, type = "info") {
  const notification = {
    title: title,
    message: message,
    time: "Just now",
    unread: true,
    type: type,
  };

  state.notifications.unshift(notification);
  loadNotifications();

  // Update badge
  const badge = document.querySelector(".notification-badge");
  if (badge) {
    const count = state.notifications.filter((n) => n.unread).length;
    badge.textContent = count;
    badge.style.display = count > 0 ? "block" : "none";
  }
}

function toggleNotifications() {
  const panel = document.getElementById("notificationPanel");
  if (!panel) return;
  panel.classList.toggle("active");
}

window.markNotificationRead = function (element) {
  element.classList.remove("unread");
  const badge = document.querySelector(".notification-badge");
  if (badge) {
    const unreadCount = document.querySelectorAll(
      ".notification-item.unread"
    ).length;
    badge.textContent = unreadCount;
    if (unreadCount === 0) {
      badge.style.display = "none";
    }
  }
};

// ===========================
// Data Export
// ===========================
function exportData(format) {
  const exportData = {
    campaigns: state.campaigns,
    metrics: state.metrics,
    summary: {
      totalCampaigns: state.campaigns.length,
      activeCampaigns: state.campaigns.filter((c) => c.status === "Active")
        .length,
      totalImpressions: state.campaigns.reduce(
        (sum, c) => sum + c.metrics.impressions,
        0
      ),
      totalClicks: state.campaigns.reduce(
        (sum, c) => sum + c.metrics.clicks,
        0
      ),
      averageCTR: state.metrics.ctr,
    },
    exported: new Date().toISOString(),
  };

  if (format === "json") {
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    downloadFile(dataBlob, `creativesync-analytics-${Date.now()}.json`);
    showToast("Export Complete", "Analytics data exported as JSON", "success");
  } else if (format === "csv") {
    const csv = convertToCSV(state.campaigns);
    const dataBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    downloadFile(dataBlob, `creativesync-campaigns-${Date.now()}.csv`);
    showToast("Export Complete", "Campaign data exported as CSV", "success");
  }
}

function convertToCSV(campaigns) {
  if (campaigns.length === 0) {
    return "No campaigns to export";
  }

  const headers = [
    "Campaign Name",
    "Created Date",
    "Status",
    "Impressions",
    "Clicks",
    "CTR (%)",
    "Engagement",
    "Reach",
  ];
  const rows = campaigns.map((c) => [
    `"${c.name}"`,
    new Date(c.created).toLocaleDateString(),
    c.status,
    c.metrics.impressions,
    c.metrics.clicks,
    c.metrics.ctr,
    c.metrics.engagement || "N/A",
    c.metrics.reach || "N/A",
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ===========================
// Utility Functions
// ===========================
function showLoading(show) {
  const overlay = document.getElementById("loadingOverlay");
  if (overlay) {
    overlay.style.display = show ? "flex" : "none";
  }
}

function showToast(title, message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.style.opacity = "0";
  toast.style.transform = "translateX(100px)";

  const icons = {
    success: "fa-check-circle",
    error: "fa-exclamation-circle",
    warning: "fa-exclamation-triangle",
    info: "fa-info-circle",
  };

  toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <div class="toast-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <button class="icon-btn" onclick="this.parentElement.remove()" style="margin-left: auto;">
            <i class="fas fa-times"></i>
        </button>
    `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = "all 0.3s ease";
    toast.style.opacity = "1";
    toast.style.transform = "translateX(0)";
  }, 10);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100px)";
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

// ===========================
// Initialize welcome message and demo data
// ===========================
setTimeout(() => {
  addChatMessage(
    "Hello! 👋 I'm your AI-powered advertising assistant. I can help you:\n\n• Create compelling campaigns\n• Generate A/B test variants\n• Analyze performance metrics\n• Detect trending topics\n• Optimize for better results\n\nWhat would you like to create today?",
    "assistant"
  );
}, 1000);

// Add some demo campaigns if none exist
if (state.campaigns.length === 0) {
  const demoCampaigns = [
    {
      id: Date.now() - 1000000,
      name: "Summer Sale 2024",
      content:
        "Exclusive summer deals with up to 50% off on selected items. Limited time offer!",
      created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "Active",
      metadata: { audience: "Young Families", type: "Seasonal Promotion" },
      metrics: {
        impressions: 145230,
        clicks: 10456,
        ctr: "7.20",
        engagement: 85,
        reach: 195000,
      },
    },
    {
      id: Date.now() - 2000000,
      name: "Holiday Shopping Guide",
      content:
        "Your complete guide to stress-free holiday shopping with Clubcard benefits.",
      created: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: "Active",
      metadata: { audience: "Premium Shoppers", type: "Brand Awareness" },
      metrics: {
        impressions: 98560,
        clicks: 6234,
        ctr: "6.32",
        engagement: 78,
        reach: 142000,
      },
    },
    {
      id: Date.now() - 3000000,
      name: "Flash Weekend Sale",
      content:
        "48-hour flash sale on electronics and home goods. Shop now before it ends!",
      created: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      status: "Completed",
      metadata: { audience: "Budget Conscious", type: "Flash Sale" },
      metrics: {
        impressions: 203450,
        clicks: 15678,
        ctr: "7.71",
        engagement: 92,
        reach: 275000,
      },
    },
  ];

  state.campaigns = demoCampaigns;
  localStorage.setItem("campaigns", JSON.stringify(state.campaigns));
  state.metrics.activeCampaigns = state.campaigns.filter(
    (c) => c.status === "Active"
  ).length;
}

// ===========================
// Keyboard Shortcuts
// ===========================
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + K to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    const searchInput = document.getElementById("searchHistory");
    if (searchInput && state.currentSection === "history") {
      searchInput.focus();
    }
  }

  // Ctrl/Cmd + N to create new campaign
  if ((e.ctrlKey || e.metaKey) && e.key === "n") {
    e.preventDefault();
    handleNavigation("create");
  }

  // Escape to close modals/panels
  if (e.key === "Escape") {
    const notifPanel = document.getElementById("notificationPanel");
    if (notifPanel && notifPanel.classList.contains("active")) {
      notifPanel.classList.remove("active");
    }
    const modal = document.getElementById("apiKeyModal");
    if (modal && modal.style.display === "flex") {
      modal.style.display = "none";
    }
  }
});

// ===========================
// Console Welcome Message
// ===========================
console.log(
  "%c🚀 CreativeSync AI",
  "font-size: 24px; font-weight: bold; color: #6366f1;"
);
console.log(
  "%cIntelligent Ad Creation Platform",
  "font-size: 14px; color: #64748b;"
);
console.log(
  "%cPowered by Google Gemini AI",
  "font-size: 12px; color: #10b981;"
);
console.log("\n💡 Tips:");
console.log("• Press Ctrl+N to create a new campaign");
console.log("• Press Ctrl+K to search campaigns");
console.log("• Press Escape to close panels");
console.log(
  "\n📚 API Key: Get yours at https://makersuite.google.com/app/apikey"
);

// ===========================
// Performance Monitoring
// ===========================
if ("performance" in window) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType("navigation")[0];
      console.log(
        "⚡ Page loaded in",
        Math.round(perfData.loadEventEnd - perfData.fetchStart),
        "ms"
      );
    }, 0);
  });
}
