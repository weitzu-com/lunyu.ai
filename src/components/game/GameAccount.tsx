"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { getProgressSnapshot } from "@/lib/game-progress";
import { gameChapters } from "@/data/confucius-game";
import { registerAccount, resolveAccountProgress, retryAccountSync, signInAccount, signOutAccount, useGameAccount } from "@/lib/game-account";
import { trapDialogFocus } from "@/lib/game-dialog";
import { GameIcon } from "./GameIcon";

const statusText = { loading: "连接账号", guest: "本地自动保存", checking: "读取云端进度", synced: "云端已保存", saving: "正在保存云端", conflict: "选择要继续的进度", error: "云端未同步" };
function saveLabel(account: ReturnType<typeof useGameAccount>) { return account.status === "synced" && account.pendingChanges ? "等待云端保存" : statusText[account.status]; }
export function AccountSaveIndicator() {
  const account = useGameAccount();
  const displayStatus = account.status === "synced" && account.pendingChanges ? "saving" : account.status;
  return <span role="status" className={`game-cloud-indicator is-${displayStatus}`}><GameIcon name={account.user ? "cloud" : "check"} size={14} />{saveLabel(account)}</span>;
}

export function GameAccount() {
  const account = useGameAccount();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) { dialogRef.current?.showModal(); const before = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => {document.body.style.overflow = before;}; }
    dialogRef.current?.close();
  }, [open]);
  function close() { setConfirmDiscard(false); setOpen(false); setError(""); setMessage(""); buttonRef.current?.focus(); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const email = String(form.get("email") ?? "").trim(); const password = String(form.get("password") ?? "");
      if (mode === "register") { const result = await registerAccount(String(form.get("name") ?? "").trim(), email, password); if (result) setMessage(result); }
      else await signInAccount(email, password);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "操作未完成，请重试。"); }
    finally { setBusy(false); }
  }
  function exportLocalJournal() {
    const progress = getProgressSnapshot();
    const entries = gameChapters.map(chapter => {
      const choices = chapter.scenes.map(scene => {
        const choice = scene.choices.find(item => item.id === progress.answers[scene.id]);
        return choice ? `### ${scene.title}\n我的选择：${choice.label}\n\n${choice.consequence}\n` : "";
      }).filter(Boolean).join("\n");
      const note = progress.reflections[chapter.id];
      return choices || note ? `## ${chapter.title}\n\n${choices}\n我的手记：${note || "尚未写下"}\n\n原文：${chapter.quote.url}\n` : "";
    }).filter(Boolean).join("\n---\n\n");
    const url = URL.createObjectURL(new Blob([`# 与孔子同行 · 此设备手记备份\n\n${entries || "尚未写下手记。"}`], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "与孔子同行-此设备手记备份.md"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("此设备手记已导出，请保管好下载文件。");
  }
  async function action(callback: () => Promise<unknown>) { setBusy(true); setError(""); try { await callback(); } catch (cause) {setError(cause instanceof Error ? cause.message : "操作未完成。");} finally {setBusy(false);} }
  return <>
    <button ref={buttonRef} className={`game-account-button ${account.user ? "is-signed-in" : ""}`} onClick={() => setOpen(true)}><span className="game-account-avatar">{account.user ? account.user.name?.slice(0,1) || "学" : <GameIcon name="user" size={17} />}</span><span>{account.user ? account.user.name || "我的账号" : "登录 / 注册"}</span>{account.status === "conflict" && <i className="game-account-alert" />}</button>
    <dialog ref={dialogRef} className="game-account-dialog" onKeyDown={trapDialogFocus} aria-labelledby="account-dialog-title" onCancel={close} onClick={(event) => {if(event.target===event.currentTarget)close();}}>
      <div className="game-account-inner"><button className="game-dialog-close" onClick={close} aria-label="关闭账号窗口"><GameIcon name="close" /></button><div className="game-account-heading"><span className="game-account-symbol"><GameIcon name={account.user ? "cloud" : "leaf"} size={29} /></span><p className="game-eyebrow">YOUR JOURNEY, ANYWHERE</p><h2 id="account-dialog-title">{account.user ? `欢迎，${account.user.name || "同行者"}` : mode === "register" ? "从此，步履有迹。" : "回来，接着走。"}</h2><p>{account.user ? "把走过的路，写下的感悟，留在你的账号里。" : "登录后保存旅程，在另一台设备上也能继续。"}</p></div>
        <div role="alert" className={error ? "game-account-error" : "game-sr-only"}>{error}</div><div role="status" className={message ? "game-account-message" : "game-sr-only"}>{message}</div>
        {!account.user ? <><div className="game-auth-tabs" role="group" aria-label="账号操作"><button type="button" aria-pressed={mode === "login"} onClick={() => {setMode("login");setError("");}}>登录</button><button type="button" aria-pressed={mode === "register"} onClick={() => {setMode("register");setError("");}}>注册账号</button></div>{mode === "register" && !account.registrationAvailable && <div className="game-account-message" role="status"><p>{account.registrationMessage || "新账号注册暂未开放，请先以游客身份体验。"}</p><button type="button" className="game-text-button" onClick={() => void action(retryAccountSync)} disabled={busy}>重新检查注册服务</button></div>}<form onSubmit={submit} key={mode} className="game-account-form">{mode === "register" && <label>怎么称呼你<input name="name" autoComplete="nickname" required minLength={1} maxLength={40} placeholder="你的名字或昵称" /></label>}<label>登录邮箱<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label><label>密码<span className="game-password-field"><input name="password" aria-label="密码" type={showPassword ? "text" : "password"} autoComplete={mode === "register" ? "new-password" : "current-password"} required minLength={mode === "register" ? 8 : 1} maxLength={128} placeholder={mode === "register" ? "至少 8 位，建议使用独立密码" : "输入你的密码"} /><button type="button" aria-label={showPassword ? "隐藏密码" : "显示密码"} onClick={() => setShowPassword(!showPassword)}><GameIcon name={showPassword ? "eye-off" : "eye"} size={18} /></button></span></label>{!account.configured && <p className="game-account-error">账号服务暂时不可用，你仍可继续本地旅程。<button type="button" className="game-text-button" onClick={() => void retryAccountSync()}>重试连接</button></p>}<button type="submit" className="game-button game-button-primary" disabled={busy || !account.configured || (mode === "register" && !account.registrationAvailable)}>{busy ? "请稍候…" : mode === "register" ? account.registrationAvailable ? "创建我的账号" : "注册暂未开放" : "登录，继续旅程"}{!busy && <GameIcon name="arrow" size={18} />}</button></form><p className="game-auth-note">邮箱目前仅用作登录名，暂不提供邮件验证或邮件找回。请使用可妥善保管的密码。</p><button className="game-text-button game-account-guest" onClick={close}>先以游客身份游玩</button></> : <div className="game-account-profile"><div className="game-account-email"><GameIcon name="user" size={18} /><span>{account.user.email}</span><small>登录名 · 未验证</small></div>
          {account.status === "conflict" ? <section className="game-save-conflict" aria-labelledby="save-conflict-title"><h3 id="save-conflict-title">发现两段不同的旅程</h3><p>选择一份继续。使用此设备进度将替换当前云端版本。</p><div><button disabled={busy} onClick={() => void action(() => resolveAccountProgress("local"))}><GameIcon name="device" size={24} /><strong>使用此设备进度</strong><small>{Object.keys(getProgressSnapshot().answers).length} / 16 次选择</small></button><button disabled={busy} onClick={() => void action(() => resolveAccountProgress("cloud"))}><GameIcon name="cloud" size={24} /><strong>使用云端进度</strong><small>{Object.keys(account.cloud?.progress.answers ?? {}).length} / 16 次选择</small></button></div></section> : <div className={`game-account-sync is-${account.status}`}><GameIcon name={account.status === "error" ? "warning" : "cloud"} size={30} /><strong>{saveLabel(account)}</strong><p>{account.error || (account.savedAt ? `最近保存：${new Date(account.savedAt).toLocaleString("zh-CN")}` : "作出选择、写下手记后，会自动保存到云端。")}</p>{account.status === "error" && <button className="game-button" onClick={() => void action(retryAccountSync)} disabled={busy}>重新连接云端</button>}</div>}
          <button className="game-button game-button-primary" onClick={close}>继续我的旅程<GameIcon name="arrow" size={18} /></button>{confirmDiscard ? <section className="game-save-conflict" role="alert" aria-label="确认退出账号"><h3>此设备还有尚未同步的内容</h3><p>可以先导出手记。放弃后，当前云端版本会保留，此设备的未同步更改会清除。</p><button className="game-button" type="button" onClick={exportLocalJournal}><GameIcon name="download" size={17} />导出此设备手记</button><button className="game-text-button game-signout" disabled={busy} onClick={() => void action(async () => { await signOutAccount({ discardUnsynced: true }); setConfirmDiscard(false); })}>放弃未同步更改并退出</button><button className="game-text-button" disabled={busy} onClick={() => setConfirmDiscard(false)}>返回，继续保留</button></section> : <button className="game-text-button game-signout" disabled={busy} onClick={() => { if (["checking", "conflict", "error"].includes(account.status)) setConfirmDiscard(true); else void action(() => signOutAccount()); }}>退出账号</button>}<p className="game-auth-note">退出前会完成同步，随后恢复此设备的游客旅程。账号进度保留在云端。</p></div>}
      </div>
    </dialog>
  </>;
}
