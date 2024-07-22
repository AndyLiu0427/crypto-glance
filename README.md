# Crypto Glance

CryptoGlance is a sleek and efficient Web3 asset management tool for cryptocurrency users. This application provides users with an intuitive overview of their cryptocurrency assets.

It demonstrates proficiency in interacting with smart contracts, implementing data visualization, and handling real-time data updates - all crucial skills for modern Web3 development.

## <a name="tech-stack">⚙️ Tech Stack</a>

- Vite
- TypeScript
- React
- Redux Toolkit
- Material-UI
- Tailwind CSS
- viem
- wagmi
- Web3-Onboard
- ESLint

## <a name="features">🔋 Features</a>

👉 **Wallet Connection**: Connections with MetaMask and network switching.

👉 **Asset Overview**
   - Display ERC20 token and ETH (gas) balances in the connected wallet.
   - Show asset USD values distribution in a pie chart.

👉 **Transaction**: 

👉 **Transaction Monitoring**: 

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

Make sure you have prepare this:
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [MetaMask Chrome extension](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)
- MetaMask account
- Get AAVE Sepolia Testnet assets by [faucet](https://staging.aave.com/faucet/) and add tokens to wallet
- Create endpoint in [QuickNode](https://www.quicknode.com/) (need login)


**Cloning the Repository**

```bash
git clone https://github.com/AndyLiu0427/crypto-glance.git
cd crypto-glance
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
VITE_QUICKNODE_ENDPOINT = "YOUR_QUICKNODE_ENDPOINT_URL"
VITE_PRIVATE_KEY = "YOUR_WALLET_PRIVATE_KEY"
```

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the project.
