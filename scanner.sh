#!/bin/bash

RESULTS="[]"

add_result() {
    local risque="$1"
    local gravite="$2"
    local recommandation="$3"
    local statut="$4"
    
    local new_item=$(cat <<EOF
{
  "risque": "$risque",
  "gravite": "$gravite",
  "recommandation": "$recommandation",
  "statut": "$statut"
}
EOF
)
    if [ "$RESULTS" = "[]" ]; then
        RESULTS="[$new_item]"
    else
        RESULTS=$(echo "$RESULTS" | sed 's/]$//')
        RESULTS="$RESULTS, $new_item]"
    fi
}

# 1. Vérification SSH (PermitRootLogin)
if [ -f /etc/ssh/sshd_config ]; then
    permit_root=$(grep -i "^PermitRootLogin" /etc/ssh/sshd_config | awk '{print $2}')
    if [ "$permit_root" = "yes" ]; then
        add_result "SSH : Connexion root autorisée" "Critique" "Désactiver PermitRootLogin dans sshd_config" "À traiter"
    else
        add_result "Configuration SSH sécurisée" "Faible" "La connexion root est bloquée" "Vérifié"
    fi
else
    add_result "Service SSH non installé" "Faible" "Aucun risque SSH détecté" "Vérifié"
fi

# 2. Vérification Pare-feu UFW
if systemctl is-active --quiet ufw; then
    add_result "Pare-feu UFW actif" "Faible" "Le pare-feu protège le système" "Vérifié"
else
    add_result "Pare-feu UFW désactivé" "Élevé" "Activer UFW (sudo ufw enable)" "À traiter"
fi

# 3. Vérification des ports en écoute (Services ouverts)
open_ports=$(ss -tuln | awk 'NR>1 {print $5}' | sed 's/.*://' | sort -n | uniq | tr '\n' ', ')
if [ -n "$open_ports" ]; then
    add_result "Ports réseau ouverts" "Moyen" "Vérifier les services actifs sur les ports: $open_ports" "En cours"
fi

# 4. Vérification des utilisateurs avec UID 0 (Privilèges Root alternatifs)
root_users=$(awk -F: '($3 == 0) {print $1}' /etc/passwd | tr '\n' ' ')
if [ "$root_users" != "root " ]; then
    add_result "Comptes multiples avec privilèges Root" "Critique" "Vérifier les utilisateurs UID 0: $root_users" "À traiter"
else
    add_result "Intégrité des comptes Root" "Faible" "Seul l'utilisateur 'root' possède les privilèges maximums" "Vérifié"
fi

# 5. Vérification du dossier personnel / permissions sensibles
if [ -d "$HOME" ]; then
    world_writable=$(find "$HOME" -maxdepth 2 -perm -002 2>/dev/null | wc -l)
    if [ "$world_writable" -gt 0 ]; then
        add_result "Fichiers accessibles en écriture par tous" "Élevé" "Restreindre les permissions (chmod) dans le dossier personnel" "À traiter"
    else
        add_result "Permissions du dossier personnel sécurisées" "Faible" "Aucun accès global non sécurisé" "Vérifié"
    fi
fi

# 6. Vérification des mises à jour système en attente
if command -v apt &> /dev/null; then
    updates=$(apt list --upgradable 2>/dev/null | grep -v "Listing..." | wc -l)
    if [ "$updates" -gt 0 ]; then
        add_result "Mises à jour système en attente ($updates)" "Moyen" "Exécuter sudo apt upgrade" "En cours"
    else
        add_result "Système à jour" "Faible" "Le système possède les derniers correctifs" "Vérifié"
    fi
fi

# Affichage final du JSON pour l'application Electron
echo "$RESULTS"
