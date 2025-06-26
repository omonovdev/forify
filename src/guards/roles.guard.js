export const RolesGuard = (includeRoles = []) => {
    return (req, res, next) => {
        const role = req.user?.role;

        
        if (role === 'superadmin') return next();

        if (!includeRoles.includes(role)) {
            return resError(res, 'Forbidden user', 403);
        }

        next();
    };
};
