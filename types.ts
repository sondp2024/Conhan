export interface StyleOptions {
  caption: string;
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  fontColor: string;
  textAlign: CanvasTextAlign;
  textPosX: number | null;
  textPosY: number | null;
  lineHeight: number;
  padding: number;
  maxWidth: number;
  bgColor: string;
  addWatermark: boolean;
  watermarkText: string;
  textShadow: boolean;
  shadowColor: string;
  shadowBlur: number;
}

export type QuoteItem = {
  id: string;
  text: string;
  category: "triet-ly" | "hai-huoc" | "ngan-gon";
  source: "twitter" | "tiktok" | "reddit" | "fb";
  likes: number;
  shares: number;
  hashtags?: string[];
};