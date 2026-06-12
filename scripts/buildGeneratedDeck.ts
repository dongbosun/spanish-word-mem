import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { Chapter, PartOfSpeech, Section, WordCard } from "../src/types/deck";

type VerbSeed = {
  spanish: string;
  english: string;
  past: string;
  gerund: string;
};

type NounSeed = {
  spanish: string;
  english: string;
  gender: "masculine" | "feminine";
  pluralSpanish?: string;
  pluralEnglish?: string;
};

type AdjectiveSeed = {
  spanish: string;
  english: string;
};

type FunctionWordSeed = {
  spanish: string;
  english: string[];
  partOfSpeech: PartOfSpeech;
  tags: string[];
};

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const dataDir = path.join(projectRoot, "src", "data");
const generatedNote =
  "Generated sample data for product testing; verify against an authoritative source before using as public course content.";

const chapters: Chapter[] = [
  {
    id: "chapter-basic",
    title: "基础高频词",
    description: "最常见的动词、名词和日常表达，适合快速建立阅读基础。",
    order: 1
  },
  {
    id: "chapter-life",
    title: "人物与生活",
    description: "围绕家庭、人物、情绪和描述性词汇建立生活场景表达。",
    order: 2
  },
  {
    id: "chapter-food-travel",
    title: "食物与出行",
    description: "覆盖餐饮、城市、交通和旅行中常见的核心词汇。",
    order: 3
  },
  {
    id: "chapter-generated-verbs",
    title: "生成样本：动词变化",
    description: "Regular-verb forms generated from seed verbs for import and scale testing.",
    order: 4
  },
  {
    id: "chapter-generated-nouns",
    title: "生成样本：名词",
    description: "Generated singular and plural noun cards for import and scale testing.",
    order: 5
  },
  {
    id: "chapter-generated-adjectives",
    title: "生成样本：形容词",
    description: "Generated adjective agreement cards for import and scale testing.",
    order: 6
  },
  {
    id: "chapter-generated-function",
    title: "生成样本：功能词与短语",
    description: "Generated function words and starter phrase cards for import and scale testing.",
    order: 7
  }
];

const sections: Section[] = [
  {
    id: "section-basic-verbs",
    chapterId: "chapter-basic",
    title: "基础动词",
    description: "高频动作和状态动词。",
    order: 1
  },
  {
    id: "section-common-nouns",
    chapterId: "chapter-basic",
    title: "常用名词",
    description: "日常交流中常见的人、物、地点和时间词。",
    order: 2
  },
  {
    id: "section-family-people",
    chapterId: "chapter-life",
    title: "家庭与人物",
    description: "称呼、关系和人物相关词汇。",
    order: 1
  },
  {
    id: "section-emotions-description",
    chapterId: "chapter-life",
    title: "情绪与描述",
    description: "表达感受和描述事物的常用词。",
    order: 2
  },
  {
    id: "section-food-dining",
    chapterId: "chapter-food-travel",
    title: "食物餐饮",
    description: "食物、饮品和点餐场景词汇。",
    order: 1
  },
  {
    id: "section-city-transport",
    chapterId: "chapter-food-travel",
    title: "城市出行",
    description: "城市地点、交通工具和旅行动作。",
    order: 2
  },
  {
    id: "section-generated-verb-nonfinite",
    chapterId: "chapter-generated-verbs",
    title: "非限定动词形式",
    description: "Infinitive, gerund and participle sample cards.",
    order: 1
  },
  {
    id: "section-generated-verb-present",
    chapterId: "chapter-generated-verbs",
    title: "现在时样本",
    description: "Regular present-tense sample cards.",
    order: 2
  },
  {
    id: "section-generated-verb-preterite",
    chapterId: "chapter-generated-verbs",
    title: "简单过去时样本",
    description: "Regular preterite sample cards.",
    order: 3
  },
  {
    id: "section-generated-verb-imperfect",
    chapterId: "chapter-generated-verbs",
    title: "过去未完成时样本",
    description: "Regular imperfect sample cards.",
    order: 4
  },
  {
    id: "section-generated-verb-future",
    chapterId: "chapter-generated-verbs",
    title: "将来时样本",
    description: "Regular future-tense sample cards.",
    order: 5
  },
  {
    id: "section-generated-verb-conditional",
    chapterId: "chapter-generated-verbs",
    title: "条件式样本",
    description: "Regular conditional sample cards.",
    order: 6
  },
  {
    id: "section-generated-noun-singular",
    chapterId: "chapter-generated-nouns",
    title: "名词单数样本",
    description: "Generated singular noun cards.",
    order: 1
  },
  {
    id: "section-generated-noun-plural",
    chapterId: "chapter-generated-nouns",
    title: "名词复数样本",
    description: "Generated plural noun cards.",
    order: 2
  },
  {
    id: "section-generated-adjective-agreement",
    chapterId: "chapter-generated-adjectives",
    title: "形容词性数配合样本",
    description: "Generated adjective agreement cards.",
    order: 1
  },
  {
    id: "section-generated-function-words",
    chapterId: "chapter-generated-function",
    title: "功能词样本",
    description: "Generated function-word cards.",
    order: 1
  },
  {
    id: "section-generated-starter-phrases",
    chapterId: "chapter-generated-function",
    title: "入门短语样本",
    description: "Generated starter phrase cards.",
    order: 2
  }
];

const verbSeeds: VerbSeed[] = [
  { spanish: "hablar", english: "speak", past: "spoke", gerund: "speaking" },
  { spanish: "estudiar", english: "study", past: "studied", gerund: "studying" },
  { spanish: "trabajar", english: "work", past: "worked", gerund: "working" },
  { spanish: "caminar", english: "walk", past: "walked", gerund: "walking" },
  { spanish: "comprar", english: "buy", past: "bought", gerund: "buying" },
  { spanish: "escuchar", english: "listen", past: "listened", gerund: "listening" },
  { spanish: "mirar", english: "watch", past: "watched", gerund: "watching" },
  { spanish: "necesitar", english: "need", past: "needed", gerund: "needing" },
  { spanish: "usar", english: "use", past: "used", gerund: "using" },
  { spanish: "tomar", english: "take", past: "took", gerund: "taking" },
  { spanish: "llamar", english: "call", past: "called", gerund: "calling" },
  { spanish: "viajar", english: "travel", past: "traveled", gerund: "traveling" },
  { spanish: "visitar", english: "visit", past: "visited", gerund: "visiting" },
  { spanish: "esperar", english: "wait", past: "waited", gerund: "waiting" },
  { spanish: "preparar", english: "prepare", past: "prepared", gerund: "preparing" },
  { spanish: "cocinar", english: "cook", past: "cooked", gerund: "cooking" },
  { spanish: "cantar", english: "sing", past: "sang", gerund: "singing" },
  { spanish: "bailar", english: "dance", past: "danced", gerund: "dancing" },
  { spanish: "entrar", english: "enter", past: "entered", gerund: "entering" },
  { spanish: "dejar", english: "leave", past: "left", gerund: "leaving" },
  { spanish: "llevar", english: "carry", past: "carried", gerund: "carrying" },
  { spanish: "ayudar", english: "help", past: "helped", gerund: "helping" },
  { spanish: "ganar", english: "win", past: "won", gerund: "winning" },
  { spanish: "pasar", english: "pass", past: "passed", gerund: "passing" },
  { spanish: "preguntar", english: "ask", past: "asked", gerund: "asking" },
  { spanish: "contestar", english: "answer", past: "answered", gerund: "answering" },
  { spanish: "terminar", english: "finish", past: "finished", gerund: "finishing" },
  { spanish: "limpiar", english: "clean", past: "cleaned", gerund: "cleaning" },
  { spanish: "lavar", english: "wash", past: "washed", gerund: "washing" },
  { spanish: "dibujar", english: "draw", past: "drew", gerund: "drawing" },
  { spanish: "pintar", english: "paint", past: "painted", gerund: "painting" },
  { spanish: "tocar", english: "touch", past: "touched", gerund: "touching" },
  { spanish: "buscar", english: "search", past: "searched", gerund: "searching" },
  { spanish: "explicar", english: "explain", past: "explained", gerund: "explaining" },
  { spanish: "practicar", english: "practice", past: "practiced", gerund: "practicing" },
  { spanish: "sacar", english: "take out", past: "took out", gerund: "taking out" },
  { spanish: "navegar", english: "navigate", past: "navigated", gerund: "navigating" },
  { spanish: "investigar", english: "research", past: "researched", gerund: "researching" },
  { spanish: "entregar", english: "deliver", past: "delivered", gerund: "delivering" },
  { spanish: "organizar", english: "organize", past: "organized", gerund: "organizing" },
  { spanish: "realizar", english: "carry out", past: "carried out", gerund: "carrying out" },
  { spanish: "cambiar", english: "change", past: "changed", gerund: "changing" },
  { spanish: "crear", english: "create", past: "created", gerund: "creating" },
  { spanish: "desear", english: "wish", past: "wished", gerund: "wishing" },
  { spanish: "olvidar", english: "forget", past: "forgot", gerund: "forgetting" },
  { spanish: "celebrar", english: "celebrate", past: "celebrated", gerund: "celebrating" },
  { spanish: "descansar", english: "rest", past: "rested", gerund: "resting" },
  { spanish: "ahorrar", english: "save money", past: "saved money", gerund: "saving money" },
  { spanish: "alquilar", english: "rent", past: "rented", gerund: "renting" },
  { spanish: "reparar", english: "repair", past: "repaired", gerund: "repairing" },
  { spanish: "cuidar", english: "care for", past: "cared for", gerund: "caring for" },
  { spanish: "publicar", english: "publish", past: "published", gerund: "publishing" },
  { spanish: "anunciar", english: "announce", past: "announced", gerund: "announcing" },
  { spanish: "aceptar", english: "accept", past: "accepted", gerund: "accepting" },
  { spanish: "rechazar", english: "reject", past: "rejected", gerund: "rejecting" },
  { spanish: "invitar", english: "invite", past: "invited", gerund: "inviting" },
  { spanish: "admirar", english: "admire", past: "admired", gerund: "admiring" },
  { spanish: "arreglar", english: "fix", past: "fixed", gerund: "fixing" },
  { spanish: "guardar", english: "keep", past: "kept", gerund: "keeping" },
  { spanish: "imaginar", english: "imagine", past: "imagined", gerund: "imagining" },
  { spanish: "observar", english: "observe", past: "observed", gerund: "observing" },
  { spanish: "revisar", english: "review", past: "reviewed", gerund: "reviewing" },
  { spanish: "comer", english: "eat", past: "ate", gerund: "eating" },
  { spanish: "beber", english: "drink", past: "drank", gerund: "drinking" },
  { spanish: "aprender", english: "learn", past: "learned", gerund: "learning" },
  { spanish: "vender", english: "sell", past: "sold", gerund: "selling" },
  { spanish: "comprender", english: "understand", past: "understood", gerund: "understanding" },
  { spanish: "vivir", english: "live", past: "lived", gerund: "living" },
  { spanish: "escribir", english: "write", past: "wrote", gerund: "writing" },
  { spanish: "recibir", english: "receive", past: "received", gerund: "receiving" }
];

const nounSeeds: NounSeed[] = [
  { spanish: "casa", english: "house", gender: "feminine" },
  { spanish: "libro", english: "book", gender: "masculine" },
  { spanish: "mesa", english: "table", gender: "feminine" },
  { spanish: "silla", english: "chair", gender: "feminine" },
  { spanish: "puerta", english: "door", gender: "feminine" },
  { spanish: "ventana", english: "window", gender: "feminine" },
  { spanish: "calle", english: "street", gender: "feminine" },
  { spanish: "ciudad", english: "city", gender: "feminine", pluralEnglish: "cities" },
  { spanish: "pueblo", english: "town", gender: "masculine" },
  { spanish: "escuela", english: "school", gender: "feminine" },
  { spanish: "universidad", english: "university", gender: "feminine", pluralEnglish: "universities" },
  { spanish: "clase", english: "class", gender: "feminine", pluralEnglish: "classes" },
  { spanish: "estudiante", english: "student", gender: "masculine" },
  { spanish: "profesor", english: "teacher", gender: "masculine" },
  { spanish: "amigo", english: "friend", gender: "masculine" },
  { spanish: "familia", english: "family", gender: "feminine", pluralEnglish: "families" },
  { spanish: "madre", english: "mother", gender: "feminine" },
  { spanish: "padre", english: "father", gender: "masculine" },
  { spanish: "hermano", english: "brother", gender: "masculine" },
  { spanish: "hermana", english: "sister", gender: "feminine" },
  { spanish: "hijo", english: "son", gender: "masculine" },
  { spanish: "hija", english: "daughter", gender: "feminine" },
  { spanish: "persona", english: "person", gender: "feminine", pluralEnglish: "people" },
  { spanish: "niño", english: "boy", gender: "masculine" },
  { spanish: "niña", english: "girl", gender: "feminine" },
  { spanish: "hombre", english: "man", gender: "masculine", pluralEnglish: "men" },
  { spanish: "mujer", english: "woman", gender: "feminine", pluralEnglish: "women" },
  { spanish: "trabajo", english: "job", gender: "masculine" },
  { spanish: "oficina", english: "office", gender: "feminine" },
  { spanish: "empresa", english: "company", gender: "feminine", pluralEnglish: "companies" },
  { spanish: "tienda", english: "store", gender: "feminine" },
  { spanish: "mercado", english: "market", gender: "masculine" },
  { spanish: "restaurante", english: "restaurant", gender: "masculine" },
  { spanish: "comida", english: "meal", gender: "feminine" },
  { spanish: "bebida", english: "drink", gender: "feminine" },
  { spanish: "fruta", english: "fruit", gender: "feminine" },
  { spanish: "verdura", english: "vegetable", gender: "feminine" },
  { spanish: "carne", english: "meat", gender: "feminine" },
  { spanish: "pescado", english: "fish", gender: "masculine" },
  { spanish: "café", english: "coffee", gender: "masculine", pluralSpanish: "cafés", pluralEnglish: "coffees" },
  { spanish: "coche", english: "car", gender: "masculine" },
  { spanish: "autobús", english: "bus", gender: "masculine", pluralSpanish: "autobuses", pluralEnglish: "buses" },
  { spanish: "tren", english: "train", gender: "masculine" },
  { spanish: "avión", english: "plane", gender: "masculine", pluralSpanish: "aviones" },
  { spanish: "bicicleta", english: "bicycle", gender: "feminine" },
  { spanish: "estación", english: "station", gender: "feminine", pluralSpanish: "estaciones" },
  { spanish: "hotel", english: "hotel", gender: "masculine" },
  { spanish: "habitación", english: "room", gender: "feminine", pluralSpanish: "habitaciones" },
  { spanish: "baño", english: "bathroom", gender: "masculine" },
  { spanish: "cama", english: "bed", gender: "feminine" },
  { spanish: "camisa", english: "shirt", gender: "feminine" },
  { spanish: "zapato", english: "shoe", gender: "masculine" },
  { spanish: "bolso", english: "bag", gender: "masculine" },
  { spanish: "día", english: "day", gender: "masculine" },
  { spanish: "noche", english: "night", gender: "feminine" },
  { spanish: "semana", english: "week", gender: "feminine" },
  { spanish: "mes", english: "month", gender: "masculine", pluralSpanish: "meses" },
  { spanish: "año", english: "year", gender: "masculine" },
  { spanish: "hora", english: "hour", gender: "feminine" },
  { spanish: "minuto", english: "minute", gender: "masculine" },
  { spanish: "mano", english: "hand", gender: "feminine" },
  { spanish: "ojo", english: "eye", gender: "masculine" },
  { spanish: "cara", english: "face", gender: "feminine" },
  { spanish: "cuerpo", english: "body", gender: "masculine" },
  { spanish: "cabeza", english: "head", gender: "feminine" },
  { spanish: "corazón", english: "heart", gender: "masculine", pluralSpanish: "corazones" },
  { spanish: "médico", english: "doctor", gender: "masculine" },
  { spanish: "hospital", english: "hospital", gender: "masculine" },
  { spanish: "farmacia", english: "pharmacy", gender: "feminine", pluralEnglish: "pharmacies" },
  { spanish: "playa", english: "beach", gender: "feminine", pluralEnglish: "beaches" },
  { spanish: "montaña", english: "mountain", gender: "feminine" },
  { spanish: "río", english: "river", gender: "masculine" },
  { spanish: "mar", english: "sea", gender: "masculine" },
  { spanish: "sol", english: "sun", gender: "masculine" },
  { spanish: "luna", english: "moon", gender: "feminine" },
  { spanish: "estrella", english: "star", gender: "feminine" },
  { spanish: "flor", english: "flower", gender: "feminine" },
  { spanish: "árbol", english: "tree", gender: "masculine", pluralSpanish: "árboles" },
  { spanish: "jardín", english: "garden", gender: "masculine", pluralSpanish: "jardines" },
  { spanish: "animal", english: "animal", gender: "masculine" },
  { spanish: "perro", english: "dog", gender: "masculine" },
  { spanish: "gato", english: "cat", gender: "masculine" },
  { spanish: "pájaro", english: "bird", gender: "masculine" },
  { spanish: "música", english: "music", gender: "feminine" },
  { spanish: "película", english: "movie", gender: "feminine" },
  { spanish: "foto", english: "photo", gender: "feminine" },
  { spanish: "carta", english: "letter", gender: "feminine" },
  { spanish: "mensaje", english: "message", gender: "masculine" },
  { spanish: "teléfono", english: "phone", gender: "masculine" },
  { spanish: "computadora", english: "computer", gender: "feminine" },
  { spanish: "pantalla", english: "screen", gender: "feminine" },
  { spanish: "llave", english: "key", gender: "feminine" },
  { spanish: "mapa", english: "map", gender: "masculine" },
  { spanish: "regalo", english: "gift", gender: "masculine" },
  { spanish: "fiesta", english: "party", gender: "feminine", pluralEnglish: "parties" },
  { spanish: "pregunta", english: "question", gender: "feminine" },
  { spanish: "respuesta", english: "answer", gender: "feminine" },
  { spanish: "problema", english: "problem", gender: "masculine" },
  { spanish: "idea", english: "idea", gender: "feminine" },
  { spanish: "historia", english: "story", gender: "feminine", pluralEnglish: "stories" },
  { spanish: "voz", english: "voice", gender: "feminine", pluralSpanish: "voces" },
  { spanish: "nombre", english: "name", gender: "masculine" },
  { spanish: "color", english: "color", gender: "masculine" }
];

const adjectiveSeeds: AdjectiveSeed[] = [
  { spanish: "alto", english: "tall" },
  { spanish: "bajo", english: "short" },
  { spanish: "bonito", english: "pretty" },
  { spanish: "feo", english: "ugly" },
  { spanish: "nuevo", english: "new" },
  { spanish: "viejo", english: "old" },
  { spanish: "bueno", english: "good" },
  { spanish: "malo", english: "bad" },
  { spanish: "pequeño", english: "small" },
  { spanish: "rápido", english: "fast" },
  { spanish: "lento", english: "slow" },
  { spanish: "frío", english: "cold" },
  { spanish: "cálido", english: "warm" },
  { spanish: "caro", english: "expensive" },
  { spanish: "barato", english: "cheap" },
  { spanish: "limpio", english: "clean" },
  { spanish: "sucio", english: "dirty" },
  { spanish: "claro", english: "clear" },
  { spanish: "oscuro", english: "dark" },
  { spanish: "largo", english: "long" },
  { spanish: "corto", english: "short" },
  { spanish: "ancho", english: "wide" },
  { spanish: "estrecho", english: "narrow" },
  { spanish: "pesado", english: "heavy" },
  { spanish: "ligero", english: "lightweight" },
  { spanish: "seco", english: "dry" },
  { spanish: "mojado", english: "wet" },
  { spanish: "lleno", english: "full" },
  { spanish: "vacío", english: "empty" },
  { spanish: "abierto", english: "open" },
  { spanish: "cerrado", english: "closed" },
  { spanish: "ocupado", english: "busy" },
  { spanish: "tranquilo", english: "calm" },
  { spanish: "nervioso", english: "nervous" },
  { spanish: "contento", english: "happy" },
  { spanish: "cansado", english: "tired" },
  { spanish: "preparado", english: "prepared" },
  { spanish: "listo", english: "ready" },
  { spanish: "rico", english: "delicious" },
  { spanish: "seguro", english: "safe" },
  { spanish: "peligroso", english: "dangerous" },
  { spanish: "famoso", english: "famous" },
  { spanish: "moderno", english: "modern" },
  { spanish: "antiguo", english: "ancient" },
  { spanish: "correcto", english: "correct" },
  { spanish: "incorrecto", english: "incorrect" },
  { spanish: "cómodo", english: "comfortable" },
  { spanish: "extraño", english: "strange" },
  { spanish: "privado", english: "private" },
  { spanish: "público", english: "public" }
];

const functionWordSeeds: FunctionWordSeed[] = [
  { spanish: "yo", english: ["I"], partOfSpeech: "pronoun", tags: ["subject-pronoun"] },
  { spanish: "tú", english: ["you", "informal singular you"], partOfSpeech: "pronoun", tags: ["subject-pronoun"] },
  { spanish: "usted", english: ["you", "formal singular you"], partOfSpeech: "pronoun", tags: ["subject-pronoun"] },
  { spanish: "él", english: ["he"], partOfSpeech: "pronoun", tags: ["subject-pronoun"] },
  { spanish: "ella", english: ["she"], partOfSpeech: "pronoun", tags: ["subject-pronoun"] },
  { spanish: "nosotros", english: ["we"], partOfSpeech: "pronoun", tags: ["subject-pronoun"] },
  { spanish: "nosotras", english: ["we", "feminine we"], partOfSpeech: "pronoun", tags: ["subject-pronoun"] },
  { spanish: "vosotros", english: ["you all", "informal plural you"], partOfSpeech: "pronoun", tags: ["subject-pronoun"] },
  { spanish: "vosotras", english: ["you all", "feminine informal plural you"], partOfSpeech: "pronoun", tags: ["subject-pronoun"] },
  { spanish: "ellos", english: ["they"], partOfSpeech: "pronoun", tags: ["subject-pronoun"] },
  { spanish: "ellas", english: ["they", "feminine they"], partOfSpeech: "pronoun", tags: ["subject-pronoun"] },
  { spanish: "me", english: ["me"], partOfSpeech: "pronoun", tags: ["object-pronoun"] },
  { spanish: "te", english: ["you", "to you"], partOfSpeech: "pronoun", tags: ["object-pronoun"] },
  { spanish: "lo", english: ["him", "it"], partOfSpeech: "pronoun", tags: ["object-pronoun"] },
  { spanish: "la", english: ["her", "it"], partOfSpeech: "pronoun", tags: ["object-pronoun"] },
  { spanish: "nos", english: ["us"], partOfSpeech: "pronoun", tags: ["object-pronoun"] },
  { spanish: "os", english: ["you all"], partOfSpeech: "pronoun", tags: ["object-pronoun"] },
  { spanish: "los", english: ["them"], partOfSpeech: "pronoun", tags: ["object-pronoun"] },
  { spanish: "las", english: ["them", "feminine them"], partOfSpeech: "pronoun", tags: ["object-pronoun"] },
  { spanish: "a", english: ["to", "at"], partOfSpeech: "preposition", tags: ["preposition"] },
  { spanish: "ante", english: ["before", "in the presence of"], partOfSpeech: "preposition", tags: ["preposition"] },
  { spanish: "bajo", english: ["under"], partOfSpeech: "preposition", tags: ["preposition"] },
  { spanish: "con", english: ["with"], partOfSpeech: "preposition", tags: ["preposition"] },
  { spanish: "contra", english: ["against"], partOfSpeech: "preposition", tags: ["preposition"] },
  { spanish: "de", english: ["of", "from"], partOfSpeech: "preposition", tags: ["preposition"] },
  { spanish: "desde", english: ["from", "since"], partOfSpeech: "preposition", tags: ["preposition"] },
  { spanish: "durante", english: ["during"], partOfSpeech: "preposition", tags: ["preposition"] },
  { spanish: "en", english: ["in", "on"], partOfSpeech: "preposition", tags: ["preposition"] },
  { spanish: "entre", english: ["between", "among"], partOfSpeech: "preposition", tags: ["preposition"] },
  { spanish: "hacia", english: ["toward"], partOfSpeech: "preposition", tags: ["preposition"] },
  { spanish: "hasta", english: ["until", "up to"], partOfSpeech: "preposition", tags: ["preposition"] },
  { spanish: "para", english: ["for", "in order to"], partOfSpeech: "preposition", tags: ["preposition"] },
  { spanish: "por", english: ["for", "by", "through"], partOfSpeech: "preposition", tags: ["preposition"] },
  { spanish: "según", english: ["according to"], partOfSpeech: "preposition", tags: ["preposition"] },
  { spanish: "sin", english: ["without"], partOfSpeech: "preposition", tags: ["preposition"] },
  { spanish: "sobre", english: ["on", "about"], partOfSpeech: "preposition", tags: ["preposition"] },
  { spanish: "tras", english: ["after", "behind"], partOfSpeech: "preposition", tags: ["preposition"] },
  { spanish: "y", english: ["and"], partOfSpeech: "conjunction", tags: ["conjunction"] },
  { spanish: "o", english: ["or"], partOfSpeech: "conjunction", tags: ["conjunction"] },
  { spanish: "pero", english: ["but"], partOfSpeech: "conjunction", tags: ["conjunction"] },
  { spanish: "porque", english: ["because"], partOfSpeech: "conjunction", tags: ["conjunction"] },
  { spanish: "aunque", english: ["although", "even though"], partOfSpeech: "conjunction", tags: ["conjunction"] },
  { spanish: "si", english: ["if"], partOfSpeech: "conjunction", tags: ["conjunction"] },
  { spanish: "cuando", english: ["when"], partOfSpeech: "conjunction", tags: ["conjunction"] },
  { spanish: "mientras", english: ["while"], partOfSpeech: "conjunction", tags: ["conjunction"] },
  { spanish: "como", english: ["as", "like"], partOfSpeech: "conjunction", tags: ["conjunction"] },
  { spanish: "que", english: ["that", "which"], partOfSpeech: "conjunction", tags: ["conjunction"] },
  { spanish: "muy", english: ["very"], partOfSpeech: "adverb", tags: ["degree"] },
  { spanish: "más", english: ["more"], partOfSpeech: "adverb", tags: ["degree"] },
  { spanish: "menos", english: ["less"], partOfSpeech: "adverb", tags: ["degree"] },
  { spanish: "también", english: ["also", "too"], partOfSpeech: "adverb", tags: ["adverb"] },
  { spanish: "tampoco", english: ["neither", "not either"], partOfSpeech: "adverb", tags: ["adverb"] },
  { spanish: "siempre", english: ["always"], partOfSpeech: "adverb", tags: ["frequency"] },
  { spanish: "nunca", english: ["never"], partOfSpeech: "adverb", tags: ["frequency"] },
  { spanish: "a veces", english: ["sometimes"], partOfSpeech: "adverb", tags: ["frequency"] },
  { spanish: "hoy", english: ["today"], partOfSpeech: "adverb", tags: ["time"] },
  { spanish: "ayer", english: ["yesterday"], partOfSpeech: "adverb", tags: ["time"] },
  { spanish: "mañana", english: ["tomorrow"], partOfSpeech: "adverb", tags: ["time"] },
  { spanish: "ahora", english: ["now"], partOfSpeech: "adverb", tags: ["time"] },
  { spanish: "luego", english: ["later"], partOfSpeech: "adverb", tags: ["time"] },
  { spanish: "antes", english: ["before"], partOfSpeech: "adverb", tags: ["time"] },
  { spanish: "después", english: ["afterward"], partOfSpeech: "adverb", tags: ["time"] },
  { spanish: "aquí", english: ["here"], partOfSpeech: "adverb", tags: ["place"] },
  { spanish: "allí", english: ["there"], partOfSpeech: "adverb", tags: ["place"] },
  { spanish: "cerca", english: ["near"], partOfSpeech: "adverb", tags: ["place"] },
  { spanish: "lejos", english: ["far"], partOfSpeech: "adverb", tags: ["place"] },
  { spanish: "dentro", english: ["inside"], partOfSpeech: "adverb", tags: ["place"] },
  { spanish: "fuera", english: ["outside"], partOfSpeech: "adverb", tags: ["place"] },
  { spanish: "sí", english: ["yes"], partOfSpeech: "other", tags: ["response"] },
  { spanish: "no", english: ["no", "not"], partOfSpeech: "other", tags: ["response", "negation"] },
  { spanish: "quizás", english: ["perhaps", "maybe"], partOfSpeech: "adverb", tags: ["response"] },
  { spanish: "gracias", english: ["thank you"], partOfSpeech: "other", tags: ["polite-expression"] },
  { spanish: "por favor", english: ["please"], partOfSpeech: "other", tags: ["polite-expression"] },
  { spanish: "perdón", english: ["sorry", "excuse me"], partOfSpeech: "other", tags: ["polite-expression"] },
  { spanish: "hola", english: ["hello"], partOfSpeech: "other", tags: ["greeting"] },
  { spanish: "adiós", english: ["goodbye"], partOfSpeech: "other", tags: ["greeting"] },
  { spanish: "hasta luego", english: ["see you later"], partOfSpeech: "other", tags: ["greeting"] },
  { spanish: "buenos días", english: ["good morning"], partOfSpeech: "other", tags: ["greeting"] },
  { spanish: "buenas tardes", english: ["good afternoon"], partOfSpeech: "other", tags: ["greeting"] }
];

const presentSubjects = [
  { key: "yo", english: "I" },
  { key: "tu", english: "you" },
  { key: "el", english: "he/she" },
  { key: "nosotros", english: "we" },
  { key: "vosotros", english: "you all" },
  { key: "ellos", english: "they" }
] as const;

const verbEndings = {
  ar: {
    present: ["o", "as", "a", "amos", "áis", "an"],
    preterite: ["é", "aste", "ó", "amos", "asteis", "aron"],
    imperfect: ["aba", "abas", "aba", "ábamos", "abais", "aban"]
  },
  er: {
    present: ["o", "es", "e", "emos", "éis", "en"],
    preterite: ["í", "iste", "ió", "imos", "isteis", "ieron"],
    imperfect: ["ía", "ías", "ía", "íamos", "íais", "ían"]
  },
  ir: {
    present: ["o", "es", "e", "imos", "ís", "en"],
    preterite: ["í", "iste", "ió", "imos", "isteis", "ieron"],
    imperfect: ["ía", "ías", "ía", "íamos", "íais", "ían"]
  }
} as const;

function readBaseWords(): WordCard[] {
  return JSON.parse(fs.readFileSync(path.join(dataDir, "baseSampleWords.json"), "utf8")) as WordCard[];
}

function writeJson(fileName: string, value: unknown) {
  fs.writeFileSync(path.join(dataDir, fileName), `${JSON.stringify(value, null, 2)}\n`);
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function pluralizeSpanish(value: string): string {
  if (value.endsWith("z")) return `${value.slice(0, -1)}ces`;
  if (/[aeiouáéíóú]$/i.test(value)) return `${value}s`;
  return `${value}es`;
}

function pluralizeEnglish(value: string): string {
  if (value.endsWith("y")) return `${value.slice(0, -1)}ies`;
  if (/(s|x|ch|sh)$/.test(value)) return `${value}es`;
  return `${value}s`;
}

function thirdPersonEnglish(value: string): string {
  const [head, ...tail] = value.split(" ");
  let third = `${head}s`;
  if (head.endsWith("y")) third = `${head.slice(0, -1)}ies`;
  if (/(s|x|ch|sh|o)$/.test(head)) third = `${head}es`;
  return [third, ...tail].join(" ");
}

function getVerbKind(infinitive: string): "ar" | "er" | "ir" {
  const ending = infinitive.slice(-2);
  if (ending !== "ar" && ending !== "er" && ending !== "ir") {
    throw new Error(`Unsupported verb ending for ${infinitive}`);
  }
  return ending;
}

function getPreteriteYo(infinitive: string, stem: string, ending: "ar" | "er" | "ir"): string {
  if (ending !== "ar") return `${stem}${verbEndings[ending].preterite[0]}`;
  if (infinitive.endsWith("car")) return `${stem.slice(0, -1)}qué`;
  if (infinitive.endsWith("gar")) return `${stem.slice(0, -1)}gué`;
  if (infinitive.endsWith("zar")) return `${stem.slice(0, -1)}cé`;
  return `${stem}${verbEndings.ar.preterite[0]}`;
}

function makeWord(input: Omit<WordCard, "notes"> & { notes?: string }): WordCard {
  const tags = Array.from(new Set([...input.tags, "generated-sample"]));
  return {
    ...input,
    tags,
    notes: input.notes ?? generatedNote
  };
}

function buildVerbWords(startRank: number): WordCard[] {
  const words: WordCard[] = [];
  let rank = startRank;

  for (const seed of verbSeeds) {
    const ending = getVerbKind(seed.spanish);
    const stem = seed.spanish.slice(0, -2);
    const endingTag = `${ending}-verb`;
    const slug = slugify(seed.spanish);

    const nonfiniteForms = [
      {
        key: "infinitive",
        spanish: seed.spanish,
        english: [`to ${seed.english}`],
        tags: ["verb", "infinitive", endingTag]
      },
      {
        key: "gerund",
        spanish: `${stem}${ending === "ar" ? "ando" : "iendo"}`,
        english: [seed.gerund],
        tags: ["verb", "gerund", endingTag]
      },
      {
        key: "participle",
        spanish: `${stem}${ending === "ar" ? "ado" : "ido"}`,
        english: [seed.past, `past participle of to ${seed.english}`],
        tags: ["verb", "participle", endingTag]
      }
    ];

    for (const form of nonfiniteForms) {
      words.push(
        makeWord({
          id: `g-v-${slug}-${form.key}`,
          spanish: form.spanish,
          english: form.english,
          partOfSpeech: "verb",
          chapterId: "chapter-generated-verbs",
          sectionId: "section-generated-verb-nonfinite",
          tags: form.tags,
          frequencyRank: rank++
        })
      );
    }

    const tenseConfigs = [
      {
        key: "present",
        sectionId: "section-generated-verb-present",
        endings: verbEndings[ending].present,
        englishFor: (subject: string) =>
          subject === "he/she" ? `${subject} ${thirdPersonEnglish(seed.english)}` : `${subject} ${seed.english}`
      },
      {
        key: "preterite",
        sectionId: "section-generated-verb-preterite",
        endings: verbEndings[ending].preterite,
        englishFor: (subject: string) => `${subject} ${seed.past}`
      },
      {
        key: "imperfect",
        sectionId: "section-generated-verb-imperfect",
        endings: verbEndings[ending].imperfect,
        englishFor: (subject: string) => `${subject} used to ${seed.english}`
      }
    ];

    for (const tense of tenseConfigs) {
      tense.endings.forEach((suffix, index) => {
        const subject = presentSubjects[index];
        const spanish =
          tense.key === "preterite" && index === 0
            ? getPreteriteYo(seed.spanish, stem, ending)
            : `${stem}${suffix}`;

        words.push(
          makeWord({
            id: `g-v-${slug}-${tense.key}-${subject.key}`,
            spanish,
            english: [tense.englishFor(subject.english)],
            partOfSpeech: "verb",
            chapterId: "chapter-generated-verbs",
            sectionId: tense.sectionId,
            tags: ["verb", tense.key, subject.key, endingTag],
            frequencyRank: rank++
          })
        );
      });
    }

    ["future", "conditional"].forEach((tense) => {
      const sectionId =
        tense === "future" ? "section-generated-verb-future" : "section-generated-verb-conditional";
      const endings = tense === "future"
        ? ["é", "ás", "á", "emos", "éis", "án"]
        : ["ía", "ías", "ía", "íamos", "íais", "ían"];

      endings.forEach((suffix, index) => {
        const subject = presentSubjects[index];
        const english =
          tense === "future"
            ? `${subject.english} will ${seed.english}`
            : `${subject.english} would ${seed.english}`;

        words.push(
          makeWord({
            id: `g-v-${slug}-${tense}-${subject.key}`,
            spanish: `${seed.spanish}${suffix}`,
            english: [english],
            partOfSpeech: "verb",
            chapterId: "chapter-generated-verbs",
            sectionId,
            tags: ["verb", tense, subject.key, endingTag],
            frequencyRank: rank++
          })
        );
      });
    });
  }

  return words;
}

function buildNounWords(startRank: number): WordCard[] {
  const words: WordCard[] = [];
  let rank = startRank;

  for (const seed of nounSeeds) {
    const slug = slugify(seed.spanish);
    const pluralSpanish = seed.pluralSpanish ?? pluralizeSpanish(seed.spanish);
    const pluralEnglish = seed.pluralEnglish ?? pluralizeEnglish(seed.english);

    words.push(
      makeWord({
        id: `g-n-${slug}-singular`,
        spanish: seed.spanish,
        english: [seed.english],
        partOfSpeech: "noun",
        chapterId: "chapter-generated-nouns",
        sectionId: "section-generated-noun-singular",
        tags: ["noun", "singular", seed.gender],
        frequencyRank: rank++
      })
    );

    words.push(
      makeWord({
        id: `g-n-${slug}-plural`,
        spanish: pluralSpanish,
        english: [pluralEnglish],
        partOfSpeech: "noun",
        chapterId: "chapter-generated-nouns",
        sectionId: "section-generated-noun-plural",
        tags: ["noun", "plural", seed.gender],
        frequencyRank: rank++
      })
    );
  }

  return words;
}

function buildAdjectiveWords(startRank: number): WordCard[] {
  const words: WordCard[] = [];
  let rank = startRank;

  for (const seed of adjectiveSeeds) {
    const stem = seed.spanish.endsWith("o") ? seed.spanish.slice(0, -1) : seed.spanish;
    const slug = slugify(seed.spanish);
    const forms = [
      { key: "masculine-singular", spanish: `${stem}o`, english: seed.english },
      { key: "feminine-singular", spanish: `${stem}a`, english: seed.english },
      { key: "masculine-plural", spanish: `${stem}os`, english: seed.english },
      { key: "feminine-plural", spanish: `${stem}as`, english: seed.english }
    ];

    for (const form of forms) {
      words.push(
        makeWord({
          id: `g-a-${slug}-${form.key}`,
          spanish: form.spanish,
          english: [form.english],
          partOfSpeech: "adjective",
          chapterId: "chapter-generated-adjectives",
          sectionId: "section-generated-adjective-agreement",
          tags: ["adjective", form.key],
          frequencyRank: rank++
        })
      );
    }
  }

  return words;
}

function buildFunctionWords(startRank: number): WordCard[] {
  return functionWordSeeds.map((seed, index) =>
    makeWord({
      id: `g-f-${String(index + 1).padStart(2, "0")}-${slugify(seed.spanish)}`,
      spanish: seed.spanish,
      english: seed.english,
      partOfSpeech: seed.partOfSpeech,
      chapterId: "chapter-generated-function",
      sectionId: "section-generated-function-words",
      tags: seed.tags,
      frequencyRank: startRank + index
    })
  );
}

function buildStarterPhrases(startRank: number): WordCard[] {
  const nouns = nounSeeds.slice(0, 15);
  const adjectives = [
    { masculine: "nuevo", feminine: "nueva", english: "new" },
    { masculine: "viejo", feminine: "vieja", english: "old" },
    { masculine: "pequeño", feminine: "pequeña", english: "small" },
    { masculine: "grande", feminine: "grande", english: "big" },
    { masculine: "bonito", feminine: "bonita", english: "pretty" },
    { masculine: "limpio", feminine: "limpia", english: "clean" },
    { masculine: "sucio", feminine: "sucia", english: "dirty" },
    { masculine: "claro", feminine: "clara", english: "clear" },
    { masculine: "oscuro", feminine: "oscura", english: "dark" },
    { masculine: "barato", feminine: "barata", english: "cheap" }
  ];
  const words: WordCard[] = [];
  let rank = startRank;

  for (const noun of nouns) {
    for (const adjective of adjectives) {
      const article = noun.gender === "feminine" ? "la" : "el";
      const spanishAdjective = noun.gender === "feminine" ? adjective.feminine : adjective.masculine;
      const spanish = `${article} ${noun.spanish} ${spanishAdjective}`;
      const english = `the ${adjective.english} ${noun.english}`;

      words.push(
        makeWord({
          id: `g-p-${slugify(noun.spanish)}-${slugify(adjective.english)}`,
          spanish,
          english: [english],
          partOfSpeech: "phrase",
          chapterId: "chapter-generated-function",
          sectionId: "section-generated-starter-phrases",
          tags: ["phrase", "noun-adjective-agreement"],
          frequencyRank: rank++
        })
      );
    }
  }

  return words;
}

function normalizeBaseWords(words: WordCard[]): WordCard[] {
  return words.map((word) => ({
    ...word,
    tags: Array.from(new Set([...word.tags, "mvp-sample"])),
    notes: word.notes ?? "MVP sample data retained for compatibility with earlier user progress."
  }));
}

function assertUniqueIds(words: WordCard[]) {
  const seen = new Set<string>();
  for (const word of words) {
    if (seen.has(word.id)) {
      throw new Error(`Duplicate word id generated: ${word.id}`);
    }
    seen.add(word.id);
  }
}

function main() {
  const baseWords = normalizeBaseWords(readBaseWords());
  let rank = Math.max(...baseWords.map((word) => word.frequencyRank ?? 0)) + 1;
  const generatedVerbWords = buildVerbWords(rank);
  rank += generatedVerbWords.length;
  const generatedNounWords = buildNounWords(rank);
  rank += generatedNounWords.length;
  const generatedAdjectiveWords = buildAdjectiveWords(rank);
  rank += generatedAdjectiveWords.length;
  const generatedFunctionWords = buildFunctionWords(rank);
  rank += generatedFunctionWords.length;
  const wordsBeforePhrases = [
    ...baseWords,
    ...generatedVerbWords,
    ...generatedNounWords,
    ...generatedAdjectiveWords,
    ...generatedFunctionWords
  ];
  const phraseCount = 3000 - wordsBeforePhrases.length;
  if (phraseCount < 0) {
    throw new Error(`Generated non-phrase cards exceed 3000; got ${wordsBeforePhrases.length}.`);
  }
  const generatedPhraseWords = buildStarterPhrases(rank).slice(0, phraseCount);

  const words = [
    ...wordsBeforePhrases,
    ...generatedPhraseWords
  ];

  if (words.length !== 3000) {
    throw new Error(`Generated deck must contain exactly 3000 words; got ${words.length}.`);
  }

  assertUniqueIds(words);
  writeJson("chapters.json", chapters);
  writeJson("sections.json", sections);
  writeJson("words.json", words);

  console.log("Generated sample deck written.");
  console.log(`Chapters: ${chapters.length}`);
  console.log(`Sections: ${sections.length}`);
  console.log(`Words: ${words.length}`);
}

main();
