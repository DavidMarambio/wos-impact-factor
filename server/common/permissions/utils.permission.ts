import { User } from "../../models/User";
import { defineAbilitiesForAmin, defineAbilitiesForGuest, defineAbilitiesForMembers } from "./roles.permission";

enum USER_ROLE {
    GUEST = "guest",
    MEMBER = "member",
    ADMIN = "admin"
}

export function getRoleAbilityForUser(user: User) {
    let ability;
    switch (user.role.valueOf()) {
        case USER_ROLE.ADMIN:
            ability = defineAbilitiesForAmin()
            break;
        case USER_ROLE.MEMBER:
            ability = defineAbilitiesForMembers()
        default:
            ability = defineAbilitiesForGuest()
            break;
    }
    return ability;
}