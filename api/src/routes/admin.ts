import express, { Router } from 'express';
import { query } from '../db/connection';
import { AuthRequest, isAdmin } from '../middleware/auth';

const router: Router = express.Router();

// Get all customers
router.get('/customers', isAdmin, async (req: AuthRequest, res) => {
  try {
    const result = await query(
      `SELECT id, email, name, email_verified, created_at FROM ocm_customers ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get customer details with subscriptions
router.get('/customers/:id', isAdmin, async (req: AuthRequest, res) => {
  try {
    const customer = await query(
      `SELECT id, email, name, email_verified, created_at FROM ocm_customers WHERE id = $1`,
      [req.params.id]
    );

    if (customer.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const subscriptions = await query(
      `SELECT * FROM ocm_subscriptions WHERE customer_id = $1`,
      [req.params.id]
    );

    res.json({
      customer: customer.rows[0],
      subscriptions: subscriptions.rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer details' });
  }
});

// Get revenue and MRR
router.get('/revenue', isAdmin, async (req: AuthRequest, res) => {
  try {
    const mrrResult = await query(
      `SELECT 
        SUM(price_monthly) as total_mrr,
        COUNT(*) as total_active_subscriptions,
        COUNT(DISTINCT customer_id) as total_customers
       FROM ocm_subscriptions
       WHERE status = 'active'`
    );

    const byTeamResult = await query(
      `SELECT team_type, COUNT(*) as count, SUM(price_monthly) as revenue
       FROM ocm_subscriptions
       WHERE status = 'active'
       GROUP BY team_type`
    );

    res.json({
      mrr: mrrResult.rows[0],
      byTeam: byTeamResult.rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
});

// Get subscription details
router.get('/subscriptions/:id', isAdmin, async (req: AuthRequest, res) => {
  try {
    const subscription = await query(
      `SELECT * FROM ocm_subscriptions WHERE id = $1`,
      [req.params.id]
    );

    if (subscription.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const instance = await query(
      `SELECT * FROM ocm_team_instances WHERE subscription_id = $1`,
      [req.params.id]
    );

    res.json({
      subscription: subscription.rows[0],
      instance: instance.rows[0] || null
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscription details' });
  }
});

// Update team instance status
router.patch('/team-instances/:id', isAdmin, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;

    if (!['deployed', 'running', 'error', 'paused'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await query(
      `UPDATE ocm_team_instances
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team instance not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update team instance' });
  }
});

// Get dashboard overview
router.get('/dashboard', isAdmin, async (req: AuthRequest, res) => {
  try {
    const totalCustomers = await query(
      `SELECT COUNT(*) as count FROM ocm_customers`
    );

    const activeSubscriptions = await query(
      `SELECT COUNT(*) as count FROM ocm_subscriptions WHERE status = 'active'`
    );

    const totalMRR = await query(
      `SELECT SUM(price_monthly) as total FROM ocm_subscriptions WHERE status = 'active'`
    );

    const recentSignups = await query(
      `SELECT * FROM ocm_customers ORDER BY created_at DESC LIMIT 5`
    );

    res.json({
      totalCustomers: totalCustomers.rows[0].count,
      activeSubscriptions: activeSubscriptions.rows[0].count,
      totalMRR: totalMRR.rows[0].total || 0,
      recentSignups: recentSignups.rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;
