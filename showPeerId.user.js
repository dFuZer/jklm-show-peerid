// ==UserScript==
// @name         Show users peerId
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show users peerId
// @author       dFuZer
// @match        https://jklm.fun/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jklm.fun
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.renderViewedUserProfile = () => {
        const profile = viewedUserProfile;

        $hide($(userProfileDiv, ".loading"));
        $show($(userProfileDiv, ".content"));

        $(userProfileDiv, ".picture img").src = profile != null && profile.picture != null ? `data:image/jpeg;base64,${profile.picture}` : "/images/auth/guest.png";
        $(userProfileDiv, ".nickname").textContent = profile != null ? profile.nickname + ` (${profile.peerId})` : "No such user";
        $(userProfileDiv, ".auth").textContent = profile != null ? getAuthTextFromProfile(profile) : "";

        const badgesDiv = $(userProfileDiv, ".badges");
        badgesDiv.innerHTML = "";
        for (const role of profile.roles) {
            const badge = badgesByRole[role];
            $make("div", badgesDiv, { textContent: `${badge.icon} ${badge.text}` });
        }

        const isSelfStaffOrCreator = selfRoles.includes("staff") || selfRoles.includes("creator");
        const isSelfLeaderOrModerator = selfRoles.includes("leader") || selfRoles.includes("moderator");
        const isOtherLeaderOrModerator = profile.roles.includes("leader") || profile.roles.includes("moderator");
        const isOtherStaffOrCreator = profile.roles.includes("staff") || profile.roles.includes("creator");

        toggleBanUserButton.textContent = profile != null && profile.roles.includes("banned") ? getText("Unban", "unban") : getText("Ban", "ban");
        $show(toggleBanUserButton, profile.peerId !== selfPeerId && (isSelfStaffOrCreator || (isSelfLeaderOrModerator && !isOtherLeaderOrModerator && !isOtherStaffOrCreator)));

        toggleModUserButton.textContent = profile != null && profile.roles.includes("moderator") ? getText("Unmod", "unmod") : getText("Mod", "mod");
        toggleModUserButton.hidden = profile.peerId === selfPeerId || (!selfRoles.includes("creator") && !selfRoles.includes("staff") && !selfRoles.includes("leader"));

        toggleMuteUserButton.textContent = profile != null && mutedPeerIds.includes(profile.peerId) ? getText("Unmute", "unmute") : getText("Mute", "mute");
        toggleMuteUserButton.hidden = profile.peerId === selfPeerId;

        $show(makeUserLeaderButton, profile.peerId !== selfPeerId && (selfRoles.includes("creator") || selfRoles.includes("staff") || selfRoles.includes("leader")));

        const ipAddressElt = $(userProfileDiv, ".ipAddress");
        ipAddressElt.textContent = profile.ipAddress || "";
        $show(ipAddressElt, selfRoles.includes("creator") || selfRoles.includes("staff"));
    }
})();