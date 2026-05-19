import { SiteData } from '../types';

export const siteData: SiteData = {
  books: {
    "tech": [],
    "finance": [],
    "life": [],
    "survival": [],
    "uncategorized": [
        "127_jp_stock"
    ]
},
  hero: {
    title: {
      prefix: "以知識武裝大腦，",
      highlight: "用 AI 解放雙手。"
    },
    searchPlaceholders: ["NVIDIA", "貨幣戰爭", "MBTI", "DeepSeek", "生存策略"],
    founder: {
      quote: "我是創辦人。這裡收錄了我精讀的 ",
      quoteHighlight: "60+ 本關鍵著作",
      image: "https://picsum.photos/id/64/300/300",
      label: "FOUNDER"
    }
  },
  bentoGrid: {
    header: {
      title: "Knowledge Framework",
      description: "Explore our curated analysis. From AI technical deep dives to global economic strategies.",
      version: "ARCHIVE_V1.0"
    },
    blocks: {
      techHero: {
        category: "Future Tech",
        title: "NVIDIA 全解密：最完整的 AI、GPU 與技術產品介紹",
        excerpt: "從硬體架構到 CUDA 生態系，深度解析 NVIDIA 如何構築 AI 時代的護城河。為什麼它是下一個工業革命的蒸汽機？"
      },
      finance: {
        category: "Global Finance",
        title: "關稅壁壘 vs. 貨幣戰爭: 全球經濟終極對決",
        excerpt: "當關稅成為武器，貨幣政策成為防盾。分析當前地緣政治下的資產配置邏輯。"
      },
      life: {
        category: "Psychology",
        title: "給每一個MBTI人格",
        excerpt: "理解人格光譜，優化人際決策模型。"
      },
      survival: {
        category: "Survival",
        title: "戰爭來臨：事前準備和生存策略",
        excerpt: "極端環境下的物資準備清單與心理建設。"
      },
      newsletter: {
        label: "Weekly Digest",
        title: "不想錯過下一波 AI 浪潮？",
        description: "訂閱週報，獲取獨家自動化模板。"
      },
      caseStudy: {
        label: "Case Study",
        title: "DeepSeek：AI時代的破局密碼",
        description: "AI 時代的破局密碼。開源模型的崛起對封閉生態的衝擊。"
      }
    }
  },
  library: {
    title: "Featured Collections",
    subtitle: "The foundation of our intelligence."
  },
  bridge: {
    problem: {
      title: ["讀完了", "《AI模擬時代》，", "然後呢？"],
      description: [
        "理論很精彩，但實踐更重要。",
        "別讓知識停留在腦中。",
        "我們將書中的智慧轉化為可執行的代碼。"
      ]
    },
    products: [
      {
        id: "chatbot",
        title: "AI 客服機器人",
        subtitle: "基於《一本揭密全球獨佔...》的商業自動化實踐",
        link: "/products/chatbot",
        type: "business"
      },
      {
        id: "companion",
        title: "AI 靈魂伴侶",
        subtitle: "源自《解密貓狗眼中的奇妙世界》的陪伴哲學",
        link: "/products/companion",
        type: "life"
      }
    ]
  }
};
