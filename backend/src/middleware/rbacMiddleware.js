const { sendForbidden } = require('../utils/response');

/**
 * RBAC Middleware Factory.
 *
 * Usage:
 *   router.post('/loans', authMiddleware, tenantResolver, requireRole('Admin', 'BranchAdmin'), controller.create)
 *
 * @param {...string} roles - Allowed role names
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return sendForbidden(res, 'No role information found.');
    }

    if (!roles.includes(req.user.role)) {
      return sendForbidden(
        res,
        `Access denied. Required role: [${roles.join(', ')}]. Your role: ${req.user.role}`
      );
    }

    next();
  };
};

/**
 * Branch scope guard — ensures BranchAdmin/FieldCollector can only access their own branch.
 *
 * Usage: add after requireRole(), reads req.params.branchId or req.body.branch_id and
 * compares against the user's branch_id from the DB user record.
 */
const branchScopeGuard = async (req, res, next) => {
  const role = req.user.role;

  // SuperAdmin and Admin can access all branches
  if (['SuperAdmin', 'Admin'].includes(role)) {
    return next();
  }

  // BranchAdmin and FieldCollector: verify branch ownership
  if (['BranchAdmin', 'FieldCollector', 'Staff'].includes(role)) {
    const { User } = req.db;
    const user = await User.findByPk(req.user.id, { attributes: ['branch_id'] });

    if (!user || !user.branch_id) {
      return sendForbidden(res, 'No branch assigned to your account.');
    }

    // Attach for downstream use
    req.userBranchId = user.branch_id;

    // If the route targets a specific branch, verify it matches
    const targetBranch = req.params.branchId || req.body.branch_id;
    if (targetBranch && targetBranch !== user.branch_id) {
      return sendForbidden(res, 'You can only access data within your assigned branch.');
    }
  }

  next();
};

module.exports = { requireRole, branchScopeGuard };
