import type { Metadata } from "next";
import Link from "@/lib/reading-link";
import "./globals.css";
export const metadata: Metadata={title:{default:"Rustless · AST 与语义分析",template:"%s · Rustless"},description:"从 Frontend 建树到 Semantic，沿 Pass1 与 Pass2 理解名字、类型和表达式。",icons:{icon:"/favicon.svg"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body><a className="skip-link" href="#main">跳到正文</a><header className="site-header"><div className="container header-inner"><Link className="brand" href="/" aria-label="Rustless 首页"><span className="brand-mark">{'{ }'}</span><span>Rustless<small>COMPILER NOTES</small></span></Link><nav aria-label="主导航"><Link href="/">首页</Link><Link href="/series">目录</Link><Link href="/about">关于</Link></nav><span className="header-note">AST / SEMANTIC</span></div></header>{children}<footer className="site-footer container"><Link className="footer-brand" href="/">{'{ }'} <span>Rustless</span></Link></footer></body></html>}

