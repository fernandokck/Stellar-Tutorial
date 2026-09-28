/**
 * Stellar Roles Guide - Interactive Application Logic
 * Comprehensive, educational, and reactive system for Stellar Governance Tiers
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initCalculator();
  initFAQAccordion();
  initFAQSearch();
  initCopyButtons();
  initNqgSimulator();
  initSmoothScroll();
});

/* ==========================================================================
   1. Theme Toggle (Dark / Light Mode)
   ========================================================================== */
function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (!themeBtn) return;

  const currentTheme = localStorage.getItem('stellar_guide_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('stellar_guide_theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Tema ${newTheme === 'dark' ? 'Cósmico Escuro' : 'Luz Estelar'} ativado!`);
  });
}

function updateThemeIcon(theme) {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (!themeBtn) return;
  themeBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  themeBtn.setAttribute('title', theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro');
}

/* ==========================================================================
   2. Interactive Tier & Eligibility Calculator
   ========================================================================== */
const ELIGIBILITY_STORAGE_KEY = 'stellar_eligibility_state_v1';

const defaultState = {
  inDiscord: false,
  linkedRole: false,
  walletConnected: false,
  hasPathfinderRole: false,
  badges: {
    sq1: false, // >=4
    sq2: false, // >=3
    sq3: false, // >=2
    sqLive: false, // >=2
    sqSide: false, // >=2
    fca00c: false, // >=1
    soroban: false, // >=2
    rpciege: false, // >=15
  },
  nqgTier: 'none', // 'none' | 'navigator' (top 33.3%) | 'pilot' (top 16.7%)
  peerApprovals: 0,
  hasDownvotes: false
};

function initCalculator() {
  const form = document.getElementById('eligibilityForm');
  if (!form) return;

  // Load saved state
  let state = loadCalculatorState();
  applyStateToForm(state);
  recalculateEligibility(state);

  // Form change listener
  form.addEventListener('change', () => {
    const currentState = getStateFromForm();
    saveCalculatorState(currentState);
    recalculateEligibility(currentState);
  });

  // Reset Button
  const resetBtn = document.getElementById('resetCalcBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      localStorage.removeItem(ELIGIBILITY_STORAGE_KEY);
      const cleanState = { ...defaultState };
      applyStateToForm(cleanState);
      recalculateEligibility(cleanState);
      showToast('Calculadora reiniciada com sucesso!');
    });
  }
}

function getStateFromForm() {
  const inDiscord = document.getElementById('chk_discord')?.checked || false;
  const linkedRole = document.getElementById('chk_linked_role')?.checked || false;
  const walletConnected = document.getElementById('chk_wallet')?.checked || false;
  const hasPathfinderRole = document.getElementById('chk_pathfinder_role')?.checked || false;

  const badges = {
    sq1: document.getElementById('badge_sq1')?.checked || false,
    sq2: document.getElementById('badge_sq2')?.checked || false,
    sq3: document.getElementById('badge_sq3')?.checked || false,
    sqLive: document.getElementById('badge_sq_live')?.checked || false,
    sqSide: document.getElementById('badge_sq_side')?.checked || false,
    fca00c: document.getElementById('badge_fca00c')?.checked || false,
    soroban: document.getElementById('badge_soroban')?.checked || false,
    rpciege: document.getElementById('badge_rpciege')?.checked || false,
  };

  const nqgSelection = document.querySelector('input[name="nqg_rank"]:checked')?.value || 'none';
  const peerApprovals = parseInt(document.getElementById('peer_approvals_select')?.value || '0', 10);
  const hasDownvotes = document.getElementById('chk_has_downvotes')?.checked || false;

  return {
    inDiscord,
    linkedRole,
    walletConnected,
    hasPathfinderRole,
    badges,
    nqgTier: nqgSelection,
    peerApprovals,
    hasDownvotes
  };
}

function applyStateToForm(state) {
  if (document.getElementById('chk_discord')) document.getElementById('chk_discord').checked = state.inDiscord;
  if (document.getElementById('chk_linked_role')) document.getElementById('chk_linked_role').checked = state.linkedRole;
  if (document.getElementById('chk_wallet')) document.getElementById('chk_wallet').checked = state.walletConnected;
  if (document.getElementById('chk_pathfinder_role')) document.getElementById('chk_pathfinder_role').checked = state.hasPathfinderRole;

  if (state.badges) {
    for (const [key, val] of Object.entries(state.badges)) {
      const el = document.getElementById(`badge_${key === 'sq1' ? 'sq1' : key === 'sq2' ? 'sq2' : key === 'sq3' ? 'sq3' : key === 'sqLive' ? 'sq_live' : key === 'sqSide' ? 'sq_side' : key}`);
      if (el) el.checked = !!val;
    }
  }

  const nqgRadio = document.querySelector(`input[name="nqg_rank"][value="${state.nqgTier}"]`);
  if (nqgRadio) nqgRadio.checked = true;

  if (document.getElementById('peer_approvals_select')) {
    document.getElementById('peer_approvals_select').value = state.peerApprovals;
  }
  if (document.getElementById('chk_has_downvotes')) {
    document.getElementById('chk_has_downvotes').checked = state.hasDownvotes;
  }
}

function saveCalculatorState(state) {
  try {
    localStorage.setItem(ELIGIBILITY_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Unable to save state to localStorage', e);
  }
}

function loadCalculatorState() {
  try {
    const saved = localStorage.getItem(ELIGIBILITY_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Unable to read state from localStorage', e);
  }
  return { ...defaultState };
}

function recalculateEligibility(state) {
  let isVerified = false;
  let isPathfinder = false;
  let isNavigator = false;
  let isPilot = false;

  const nextSteps = [];

  // 1. Verified Tier Check
  if (state.inDiscord && state.linkedRole && state.walletConnected) {
    isVerified = true;
  } else {
    if (!state.inDiscord) nextSteps.push('Entrar no Discord Oficial da Stellar (`discord.com/invite/stellardev`)');
    if (!state.linkedRole) nextSteps.push('Vincular pelo menos uma conta social (GitHub/Twitter/Steam) no Discord via Linked Roles');
    if (!state.walletConnected) nextSteps.push('Autenticar sua carteira Stellar no SCF Dashboard (`communityfund.stellar.org/tiers`)');
  }

  // 2. Pathfinder Check
  const hasBadgePath = Object.values(state.badges || {}).some(b => b === true);
  const qualifiesForPathfinder = isVerified && (state.hasPathfinderRole || hasBadgePath);

  if (qualifiesForPathfinder) {
    isPathfinder = true;
  } else if (isVerified) {
    nextSteps.push('Conquistar 1 Role Especial no Discord (@SCF Project, @Ambassador President ou @SDF Role) OU completar badges em Quests públicas da Stellar (ex: Soroban Quest min. 2 badges, RPCiege min. 15, ou Stellar Quests)');
  }

  // 3. Navigator Check
  // Requisitos: isPathfinder + NQG top 33.3% + >= 5 aprovações + 0 downvotes
  const hasNavigatorNQG = state.nqgTier === 'navigator' || state.nqgTier === 'pilot';
  const hasApprovals = state.peerApprovals >= 5;
  const noDownvotes = !state.hasDownvotes;

  if (isPathfinder && hasNavigatorNQG && hasApprovals && noDownvotes) {
    isNavigator = true;
  } else if (isPathfinder) {
    if (!hasNavigatorNQG) nextSteps.push('Participar de rodadas de Community Vote e entrar nas listas de confiança (Trustlists) para atingir o Top 33.3% no NQG');
    if (state.peerApprovals < 5) nextSteps.push(`Realizar auto-nomeação na janela oficial e obter mais ${5 - state.peerApprovals} aprovação(ões) de Navigators ou Pilots`);
    if (state.hasDownvotes) nextSteps.push('Atenção: Você possui downvotes registrados. A aprovação exige ZERO downvotes');
  }

  // 4. Pilot Check
  // Requisitos: isPathfinder + NQG top 16.7% + >= 5 aprovações de Pilots + 0 downvotes
  const hasPilotNQG = state.nqgTier === 'pilot';
  if (isNavigator && hasPilotNQG && hasApprovals && noDownvotes) {
    isPilot = true;
  } else if (isNavigator) {
    if (!hasPilotNQG) nextSteps.push('Aumentar pontuação de governança para atingir o Top 16.7% com maior poder de voto relativo (NQG)');
    nextSteps.push('Obter aprovações exclusivas de membros Pilots durante a janela oficial');
  }

  // Determine Current Achieved Role
  let currentRole = 'Iniciante (Sem Role)';
  let roleClass = 'tier-none';
  let progressPct = 10;
  let roleDescription = 'Você ainda não concluiu os passos básicos de verificação na Stellar.';

  if (isPilot) {
    currentRole = '🚀 Pilot (Nível Máximo)';
    roleClass = 'tier-pilot';
    progressPct = 100;
    roleDescription = 'Parabéns! Você alcançou o nível mais alto de governança na Stellar, com voto direto de alto impacto e aprovação do conselho de Pilots.';
  } else if (isNavigator) {
    currentRole = '🥇 Navigator';
    roleClass = 'tier-navigator';
    progressPct = 75;
    roleDescription = 'Excelente! Você é um Navigator oficial: vota diretamente em projetos do SCF e participa ativamente das decisões de financiamento.';
  } else if (isPathfinder) {
    currentRole = '🥈 Pathfinder';
    roleClass = 'tier-pathfinder';
    progressPct = 50;
    roleDescription = 'Ótimo trabalho! Você comprovou expertise técnica e já pode escolher um delegado de confiança para exercer seu voto no Community Fund.';
  } else if (isVerified) {
    currentRole = '🥉 Verified Member';
    roleClass = 'tier-verified';
    progressPct = 25;
    roleDescription = 'Você é um membro verificado oficial. Agora construa sua reputação adquirindo badges ou roles especiais para virar Pathfinder!';
  }

  // Update UI Elements
  const currentRoleEl = document.getElementById('calcCurrentTierTitle');
  const currentRolePill = document.getElementById('calcCurrentTierPill');
  const currentRoleDesc = document.getElementById('calcCurrentTierDesc');
  const progressBar = document.getElementById('calcProgressBarFill');
  const progressText = document.getElementById('calcProgressPercentText');
  const nextStepsList = document.getElementById('calcNextStepsList');

  if (currentRoleEl) currentRoleEl.textContent = currentRole;
  if (currentRoleDesc) currentRoleDesc.textContent = roleDescription;
  
  if (currentRolePill) {
    currentRolePill.className = `current-tier-pill ${roleClass}`;
    currentRolePill.textContent = isPilot ? 'PILOT TIER' : isNavigator ? 'NAVIGATOR TIER' : isPathfinder ? 'PATHFINDER TIER' : isVerified ? 'VERIFIED TIER' : 'NÃO VERIFICADO';
  }

  if (progressBar) progressBar.style.width = `${progressPct}%`;
  if (progressText) progressText.textContent = `${progressPct}%`;

  if (nextStepsList) {
    nextStepsList.innerHTML = '';
    if (nextSteps.length === 0 && isPilot) {
      nextStepsList.innerHTML = `<li style="color: #10b981;">✨ Você já atingiu todos os requisitos máximos do ecossistema SCF! Continue votando com excelência e avaliando novos participantes.</li>`;
    } else {
      nextSteps.forEach(step => {
        const li = document.createElement('li');
        li.innerHTML = `<span>👉</span> <div>${step}</div>`;
        nextStepsList.appendChild(li);
      });
    }
  }
}

/* ==========================================================================
   3. Neural Quorum Governance (NQG) Interactive Simulator
   ========================================================================== */
function initNqgSimulator() {
  const rolesWeightInput = document.getElementById('simDiscordRoles');
  const votingHistoryInput = document.getElementById('simVotingHistory');
  const trustlistsInput = document.getElementById('simTrustlists');

  const simResultScore = document.getElementById('simScoreOutput');
  const simPercentileOutput = document.getElementById('simPercentileOutput');
  const simTierBadge = document.getElementById('simTierOutputBadge');

  if (!rolesWeightInput || !votingHistoryInput || !trustlistsInput) return;

  function updateSimulation() {
    const rolesVal = parseFloat(rolesWeightInput.value) || 0;
    const votesVal = parseFloat(votingHistoryInput.value) || 0;
    const trustVal = parseFloat(trustlistsInput.value) || 0;

    // Simulated weighted NQG governance formula
    const rawScore = (rolesVal * 25) + (votesVal * 45) + (trustVal * 30);
    const normalizedScore = Math.min(Math.round(rawScore), 100);

    // Percentile rank estimation:
    // Score > 80 -> Top 15% (Pilot)
    // Score > 60 -> Top 30% (Navigator)
    // Score > 30 -> Top 60% (Pathfinder/Community)
    let percentile = 100 - (normalizedScore * 0.95);
    percentile = Math.max(1, Math.min(99, Math.round(percentile * 10) / 10));

    if (simResultScore) simResultScore.textContent = `${normalizedScore} pts`;
    if (simPercentileOutput) simPercentileOutput.textContent = `Top ~${percentile}% do ecossistema`;

    if (simTierBadge) {
      if (percentile <= 16.7) {
        simTierBadge.className = 'current-tier-pill tier-pilot';
        simTierBadge.textContent = '🚀 Elegível para PILOT (Top 16.7%)';
      } else if (percentile <= 33.3) {
        simTierBadge.className = 'current-tier-pill tier-navigator';
        simTierBadge.textContent = '🥇 Elegível para NAVIGATOR (Top 33.3%)';
      } else {
        simTierBadge.className = 'current-tier-pill tier-none';
        simTierBadge.textContent = '🥈 Elegível para Pathfinder (Abaixo do Top 33.3%)';
      }
    }
  }

  rolesWeightInput.addEventListener('input', updateSimulation);
  votingHistoryInput.addEventListener('input', updateSimulation);
  trustlistsInput.addEventListener('input', updateSimulation);

  updateSimulation();
}

/* ==========================================================================
   4. FAQ Accordion & Live Filter
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close others if desired, or toggle
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
      item.classList.toggle('active', !isActive);
    });
  });
}

function initFAQSearch() {
  const searchInput = document.getElementById('faqSearchInput');
  const faqItems = document.querySelectorAll('.faq-item');
  if (!searchInput || !faqItems.length) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    let matchCount = 0;

    faqItems.forEach(item => {
      const q = item.querySelector('.faq-question-btn')?.textContent.toLowerCase() || '';
      const a = item.querySelector('.faq-answer')?.textContent.toLowerCase() || '';

      if (q.includes(query) || a.includes(query)) {
        item.style.display = 'block';
        matchCount++;
      } else {
        item.style.display = 'none';
      }
    });

    const noResults = document.getElementById('faqNoResults');
    if (noResults) {
      noResults.style.display = matchCount === 0 ? 'block' : 'none';
    }
  });
}

/* ==========================================================================
   5. Copy to Clipboard Utility & Toast Notifications
   ========================================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-link-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Link copiado: ${textToCopy}`);
        }).catch(() => {
          // Fallback
          showToast('Copiado para a área de transferência!');
        });
      }
    });
  });
}

let toastTimeout = null;
function showToast(message) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>⚡</span> <div>${message}</div>`;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   6. Smooth Scrolling & Active Nav Highlighting
   ========================================================================== */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
