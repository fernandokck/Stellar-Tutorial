# 🌌 Seja Stellar — Guia de Roles & Governança da Stellar Blockchain (SCF)

> Guia interativo, didático e moderno para instruir a comunidade sobre como conquistar e evoluir nas roles de governança do ecossistema da Stellar Blockchain (**Verified Member**, **Pathfinder**, **Navigator** e **Pilot**).

![Seja Stellar Verified Badge](./assets/hero-badge.png)

---

## 🌟 Funcionalidades Principais

- 🥇 **Visão Geral dos 4 Tiers Oficiais:**
  - **🥉 Verified:** Verificação social no Discord via *Linked Roles* + conexão de wallet no SCF Dashboard.
  - **🥈 Pathfinder:** Comprovação de expertise técnica via roles de liderança no Discord ou badges em Quests públicas (Soroban Quest, RPCiege, Stellar Quest L1-L3, FCA00C). Habilita **votação delegada**.
  - **🥇 Navigator:** Top ~33,3% de poder relativo no sistema NQG (*Neural Quorum Governance*), mínimo de 5 aprovações de pares e 0 downvotes. Habilita **voto direto** nos projetos do SCF.
  - **🚀 Pilot:** Top ~16,7% de poder relativo no NQG, mínimo de 5 aprovações exclusivas de Pilots e 0 downvotes. Habilita **voto direto de alto impacto**.

- 📋 **Trilha Didática de 8 Passos:**
  - Roteiro completo baseado na documentação oficial do *Stellar Community Fund*, com instruções práticas, dicas de segurança e links diretos.

- 🎬 **Tutoriais em Vídeo Integrados (8 Quests Oficiais):**
  - Galeria de miniaturas interativas com vídeos passo a passo para resolução das quests e obtenção dos badges on-chain, além do link direto para a playlist completa no YouTube.

- 🧮 **Calculadora de Nível & Elegibilidade Interativa:**
  - Checklist em tempo real que calcula a role atual do usuário, porcentagem de progresso até o nível máximo e lista personalizada de próximos passos.
  - Persistência automática no navegador (`localStorage`).

- 🧠 **Simulador Visual de Governança Neural (NQG):**
  - Sliders para simular a influência de *Roles no Discord*, *Histórico de Votos* e *Listas de Confiança (Trustlists)* na pontuação de governança e no percentil relativo.

- 🎨 **Design System Web3 & Alternância de Temas:**
  - Alternância entre **Modo Cósmico Escuro** e **Modo Starlight Claro**.
  - Efeito 3D de flutuação suave (`floatMedallion`), sombras realistas e partículas cintilantes (*sparkles*).
  - 100% responsivo para mobile, tablets e desktops.

- 🔍 **FAQ com Busca em Tempo Real:**
  - Filtro instantâneo para tirar dúvidas sobre o processo de nomeação, janelas trimestrais de aprovação e carteiras compatíveis (Freighter, Albedo, etc.).

---

## 🚀 Como Executar Localmente

Como o projeto é construído em HTML, CSS e JavaScript puros (Vanilla), basta qualquer servidor estático ou abrir o `index.html` diretamente no navegador:

```bash
# Clone o repositório
git clone https://github.com/fernandokck/Stellar-Tutorial.git

# Acesse o diretório
cd Stellar-Tutorial

# Inicie um servidor local simples com Python
python3 -m http.server 3000
```

Abra seu navegador em [http://localhost:3000](http://localhost:3000).

---

## 📁 Estrutura de Arquivos

```
Stellar-Tutorial/
├── index.html            # Estrutura semântica e acessível da aplicação
├── README.md             # Documentação do repositório
├── css/
│   └── style.css         # Design system, temas claro/escuro e animações
├── js/
│   └── app.js           # Lógica interativa, calculadora, simulador e filtros
└── assets/
    ├── hero-badge.png    # Medalhão 3D oficial com efeito flutuante
    └── hero.jpg          # Ilustração dos tiers de governança
```

---

## 🔗 Links Oficiais da Stellar

- [Stellar Community Fund (SCF)](https://communityfund.stellar.org)
- [SCF Tiers Dashboard](https://communityfund.stellar.org/tiers)
- [Stellar Developers Discord](https://discord.com/invite/stellardev)
- [Soroban Smart Contracts](https://soroban.stellar.org)
- [Documentação Oficial da Stellar](https://developers.stellar.org)

---

Desenvolvido para a comunidade Stellar Blockchain 🚀
