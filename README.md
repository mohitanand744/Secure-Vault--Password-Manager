# Secure Vault (Zero-Knowledge Password Manager)

A client-side-only secure vault / password manager built using **Next.js**, **Tailwind CSS 3.4**, and **TypeScript**. 

All cryptographic operations are executed in-browser using the native **Web Crypto API**. Plaintext secrets, raw master passwords, or derived encryption keys are **never stored** on disk. They exist strictly in React memory when the vault is unlocked, and are instantly wiped when locked manually or on page refresh.

---

## 🛠️ Tech Stack & Key Choices

- **Framework**: Next.js (App Router, Static Export ready)
- **Styling**: Tailwind CSS v3.4 (with customized dark theme extensions)
- **Encryption Engine**: Native Browser **Web Crypto API** (No third-party crypto dependencies)
- **Persistence**: `localStorage` (encapsulating only base64-encoded encrypted ciphertexts and salts)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18+) and **npm** (v9+) installed.

### Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

3. **Build the production bundle:**
   ```bash
   npm run build
   ```

---

## 📂 Folder Structure

The project has a modular, scalable architecture structured as follows:

```text
src/
├── app/                  # Next.js page routing and layout
│   ├── globals.css       # Global styles (Tailwind configuration directives)
│   ├── icon.png          # App branding logo / favicon asset
│   ├── layout.tsx        # Main App Layout (font definitions, page wrapper)
│   └── page.tsx          # Main entry page pointing to VaultApp
│
├── components/
│   ├── ui/               # Core UI primitive components
│   │   ├── Badge.tsx     # Colored labels (e.g. "Has Notes", "AES-256")
│   │   ├── Button.tsx    # Styled buttons with spinner states
│   │   ├── Card.tsx      # Hoverable dashboard cards
│   │   ├── ConfirmModal.tsx # Reusable double-action warning modals
│   │   ├── CopyButton.tsx# Copier triggers with useClipboard
│   │   ├── Input.tsx     # Inputs with validations and right accessories
│   │   ├── LoadingScreen.tsx # Concentric animated layout loader
│   │   ├── Modal.tsx     # Dialog modals with body-locking and escape keys
│   │   └── Textarea.tsx  # Styled textarea inputs
│   │
│   └── vault/            # App feature-specific components
│       ├── EmptyVault.tsx      # Standard empty vault layout
│       ├── LockedScreen.tsx    # Main entry screen (Unlock / Setup password)
│       ├── PasswordGenerator.tsx# Slider/CSPRNG password generator
│       ├── SearchBar.tsx       # In-memory search input
│       ├── SecretCard.tsx      # Individual secrets preview and controls
│       ├── SecretDetails.tsx   # Detailed modal with password unmasking
│       ├── SecretForm.tsx      # Add secrets form featuring inline generator
│       ├── SecretList.tsx      # Secret list grid container
│       ├── UnlockedVault.tsx   # Unlocked vault search and list view coordinator
│       ├── VaultApp.tsx        # Root coordinator (swaps screens and handles states)
│       └── VaultHeader.tsx     # Responsive brand bar with lock actions
│
├── constants/
│   └── storageKeys.ts    # Key constants (VAULT_STORAGE_KEY)
│
├── hooks/
│   ├── useClipboard.ts         # Clipboard manager with auto-clear timeout
│   ├── usePasswordGenerator.ts # CSPRNG generator engine
│   └── useVault.ts             # State machine hook orchestrating local-storage & crypto
│
├── lib/
│   ├── crypto/
│   │   ├── constants.ts   # Crypto iteration values and length constants
│   │   ├── cryptoService.ts# Subtles key derivation, GCM encrypt/decrypt layers
│   │   └── encoding.ts    # Binary-to-Base64 & String buffer converters
│   │
│   └── storage/
│       └── vaultStorage.ts# LocalStorage interfaces (SSR-safe)
│
├── types/
│   └── vault.ts          # Strongly typed TS interfaces (Secret, Payload, Kdf)
│
└── utils/
    ├── cn.ts             # Tailwind Class merger (clsx + tailwind-merge)
    └── validators.ts     # Input checks for secrets and master passwords
```

---

## 🔒 Security Architecture & Decisions

### 1. Key Derivation (PBKDF2)
When the user submits their master password, it is never stored. Instead:
- We run the raw password through the **PBKDF2** (Password-Based Key Derivation Function 2) algorithm using **SHA-256** and **250,000 iterations**. 
- The iteration count meets and exceeds standard recommendations, ensuring the derived key is highly resistant to offline GPU brute-force attacks if the database payload is stolen.
- A **16-byte (128-bit) cryptographically secure random salt** is generated using `crypto.getRandomValues()` during initialization and stored plaintext alongside the encrypted vault payload.

### 2. Encryption (AES-GCM 256)
- The secrets list is JSON-serialized and encrypted using **AES-GCM** with a **256-bit derived key**.
- We use a unique **12-byte (96-bit) Initialization Vector (IV)** generated by browser CSPRNG (`crypto.getRandomValues()`) for *every single encryption cycle*. This prevents block replay attacks.
- AES-GCM includes authentication tags (AEAD), ensuring the vault data cannot be modified or tampered with offline without failing decryption.

### 3. Memory-Only Sandboxing
- Decrypted secrets and the derived `CryptoKey` are kept exclusively in transient React state. 
- The `CryptoKey` is initialized with `extractable: false`, meaning it cannot be extracted or copied out of the JavaScript context by external inspector tools.
- When the user locks the vault or refreshes the page, the React state is garbage-collected. The vault is locked instantly.

### 4. Clipboard Auto-Clear
- Copying a password triggers a timeout (defaulting to **10 seconds**).
- After the timeout, the clipboard contents are overwritten with an empty string (`""`) using the browser Clipboard API. This prevents credentials from being pasted elsewhere after use.

---

## 📊 Storage Format

The database payload saved in `localStorage` uses the following structure:

```json
{
  "version": 1,
  "kdf": {
    "name": "PBKDF2",
    "hash": "SHA-256",
    "iterations": 250000,
    "salt": "base64StringContainingUniqueSalt..."
  },
  "encryption": {
    "algorithm": "AES-GCM",
    "iv": "base64StringContainingUniqueIV...",
    "ciphertext": "base64StringContainingEncryptedSecretsJSON..."
  }
}
```

### ❌ What is NEVER Stored:
1. **Master Password**: Never stored in memory variables long-term, nor written to local storage or cookies.
2. **Derived CryptoKey**: Exists purely as an in-memory `CryptoKey` reference inside React context.
3. **Plaintext Secrets**: All usernames, passwords, notes, and titles are stored only as a single encrypted cipher text.

---

## ⚠️ Assumptions and Limitations

- **Browser Context Compatibility**: Requires a modern secure environment (HTTPS or `localhost`) supporting the Web Crypto API.
- **Physical Device Security**: Since `localStorage` is shared within the browser origin, this project assumes no malicious extensions or XSS exploits are running within the same origin.
- **Wipe Utility**: We have included a "Wipe Local Storage" factory reset button. If users forget their Master Password, they can erase their database and create a brand new vault.

---

## ✨ Recent UI/UX and Security Polish

To meet top-tier application standards, the following enhancements have been successfully integrated:

1. **Favicon and Branding Integration**:
   - Replaced default favicon assets with a premium secure shield-vault icon (`src/app/icon.png`).
   - Integrated the unified branding icon across both the locked setup screen and the dynamic vault header logo.

2. **Dynamic Lazy-Loading & Authentication Loaders**:
   - Integrated dynamic chunks for `VaultApp` hydration.
   - Designed a modern concentric spinning theme-matching loader component (`src/components/ui/LoadingScreen.tsx`) to show during state transitions and decryption cycles.

3. **Premium Slider Component**:
   - Configured custom CSS ranges for the password generator length slider.
   - Enhanced track fills, hover states, active transitions, and glowing indicator shadows matching the brand's primary color theme.

4. **Cleaner Error Feedback**:
   - Removed intrusive alert toasts during incorrect decryption passwords.
   - Replaced with local validation error message layouts below password input fields to keep UX noise to a minimum.

5. **Production-Grade Clean Code base**:
   - Stripped all inline comments, section helpers, documentation explainers, and JSDocs across all workspace files, yielding a production-ready, clean, self-documenting code base.
