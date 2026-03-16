import express, { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/connection';
import { AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

const TEAMS = {
  social_media: { name: 'Social Media Manager', price: 99 },
  lead_gen: { name: 'Lead Generation Bot', price: 149 },
  support: { name: 'Customer Support Agent', price: 199 }
};

// Get user's subscriptions
router.get('/', async (req: AuthRequest, res) => {
  try {
    const result = await query(
      `SELECT * FROM ocm_subscriptions WHERE customer_id = $1 ORDER BY created_at DESC`,
      [req.user?.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Get single subscription
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const result = await query(
      `SELECT * FROM ocm_subscriptions WHERE id = $1 AND customer_id = $2`,
      [req.params.id, req.user?.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Create subscription
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { teamType } = req.body;

    if (!teamType || !Object.keys(TEAMS).includes(teamType)) {
      return res.status(400).json({ error: 'Invalid team type' });
    }

    const subscriptionId = uuidv4();
    const apiKey = `ocm_${uuidv4()}`;
    const price = (TEAMS as any)[teamType].price;

    // Check if already subscribed to this team
    const existing = await query(
      `SELECT id FROM ocm_subscriptions WHERE customer_id = $1 AND team_type = $2 AND status = 'active'`,
      [req.user?.id, teamType]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Already subscribed to this team' });
    }

    const result = await query(
      `INSERT INTO ocm_subscriptions (id, customer_id, team_type, tier, status, price_monthly, api_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [subscriptionId, req.user?.id, teamType, 'starter', 'active', price, apiKey]
    );

    // Create team instance
    const instanceId = uuidv4();
    await query(
      `INSERT INTO ocm_team_instances (id, subscription_id, status)
       VALUES ($1, $2, $3)`,
      [instanceId, subscriptionId, 'deployed']
    );

    res.status(201).json({
      subscription: result.rows[0],
      message: 'Subscription created successfully'
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Update subscription
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { status, tier } = req.body;

    const result = await query(
      `UPDATE ocm_subscriptions
       SET status = COALESCE($1, status), tier = COALESCE($2, tier), updated_at = NOW()
       WHERE id = $3 AND customer_id = $4
       RETURNING *`,
      [status, tier, req.params.id, req.user?.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

// Cancel subscription
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const result = await query(
      `UPDATE ocm_subscriptions
       SET status = 'cancelled', updated_at = NOW()
       WHERE id = $1 AND customer_id = $2
       RETURNING *`,
      [req.params.id, req.user?.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({ message: 'Subscription cancelled', subscription: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Get team instance details
router.get('/:id/instance', async (req: AuthRequest, res) => {
  try {
    const result = await query(
      `SELECT ti.* FROM ocm_team_instances ti
       JOIN ocm_subscriptions os ON ti.subscription_id = os.id
       WHERE os.id = $1 AND os.customer_id = $2`,
      [req.params.id, req.user?.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team instance not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team instance' });
  }
});

export default router;
