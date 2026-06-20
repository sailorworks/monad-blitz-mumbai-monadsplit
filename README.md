# Monadsplit 🔹

> **The On-Chain CFO for your Autonomous AI Agents.**  
> *Budget, control, and audit every transaction on Monad.*

Monadsplit is a powerful financial control layer designed to sit between your autonomous AI agents and the blockchain. It ensures that agents can transact autonomously without sacrificing security, transparency, or budget control.

## 🌟 Key Features

- **🛡️ Vendor Allowlisting:** Restrict agent spending exclusively to pre-approved smart contracts and protocols.
- **⏱️ Dynamic Budgets:** Set daily, weekly, or monthly spend limits per agent. Execution pauses automatically when thresholds are reached.
- **📊 Immutable Audit Trail:** Every approved and rejected transaction is logged on-chain with cryptographic certainty.
- **⚡ Built on Monad:** High-performance, EVM-compatible execution layer.

---

## 🏗️ Architecture

The project is structured as a monorepo containing two main parts:

### 1. `contracts/` (Smart Contracts)
Built with **Foundry** and deployed on the Monad Testnet.
- `AgentRegistry.sol`: Identity management for autonomous agents.
- `BudgetPolicyManager.sol`: Core logic enforcing spend limits and rules.
- `VendorAllowlist.sol`: Whitelist of approved addresses agents can interact with.
- `AuditLogger.sol`: On-chain event emission for the dashboard.
- `EmergencyKillSwitch.sol`: Global and per-agent pause mechanisms.

### 2. `web/` (Frontend Dashboard)
A premium B2B dashboard built with **Next.js 16 (App Router)** and **Tailwind CSS**.
- Interacts with the Monad smart contracts via `wagmi` and `viem`.
- Real-time activity feed, Kanban-style agent tracking, and policy management.
- Beautiful, fully custom UI featuring glassmorphism and subtle micro-animations.

---

## 🚀 Getting Started

### Local Development (Frontend)

To run the Next.js dashboard locally:

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Wallet Integration (Para)
The frontend utilizes **Para** for embedded wallet authentication. Before full functionality works, you must initialize the Para CLI:
```bash
npm install -g @getpara/cli
para login
para init
```

---

## 🌐 Deploy to Vercel

The frontend is natively optimized for Vercel deployment. No custom configuration is required.

1. Go to your [Vercel Dashboard](https://vercel.com/new).
2. Import this repository.
3. **Important:** Change the **Root Directory** setting to `web` during setup.
4. Add your `NEXT_PUBLIC_PARA_API_KEY` (and any other wallet keys) in the Environment Variables section.
5. Click **Deploy**.

---

## 📜 License
MIT License. Built for the Monad ecosystem.
