import pool from '../config/database.js';

// GET ALL FAMILIES FOR DIRECTORY
export const getDirectoryMembers = async (req, res) => {
  try {
    const { search } = req.query;

    let query = `
      SELECT 
        f.id,
        f.full_name as name,
        f.mobile_no,
        f.job_business_details as occupation,
        f.village_name as city,
        f.photo_url,
        COUNT(fm.id) as family_size
      FROM families f
      LEFT JOIN family_members fm ON f.id = fm.family_id
      WHERE f.payment_status = 'completed'
    `;

    const params = [];

    // Add search filter if provided
    if (search) {
      query += ` AND (f.full_name LIKE ? OR f.village_name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` GROUP BY f.id ORDER BY f.created_at DESC`;

    const [families] = await pool.query(query, params);

    // Format the response
    const formattedMembers = families.map(member => ({
      id: member.id,
      name: member.name || 'N/A',
      occupation: member.occupation || 'Not specified',
      city: member.city || 'Not specified',
      phone: member.mobile_no || 'N/A',
      familySize: member.family_size + 1, // +1 for the head
    }));

    res.status(200).json({
      success: true,
      data: formattedMembers,
      total: formattedMembers.length,
    });
  } catch (error) {
    console.error('Get directory members error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// GET FAMILY DETAILS BY ID
export const getFamilyDetails = async (req, res) => {
  try {
    const { familyId } = req.params;

    // Get family details
    const [families] = await pool.query(
      `SELECT * FROM families WHERE id = ?`,
      [familyId]
    );

    if (families.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Family not found',
      });
    }

    const family = families[0];

    // Get family members
    const [members] = await pool.query(
      `SELECT * FROM family_members WHERE family_id = ? ORDER BY created_at`,
      [familyId]
    );

    res.status(200).json({
      success: true,
      data: {
        familyHead: {
          id: family.id,
          fullName: family.full_name,
          mobileNo: family.mobile_no,
          villageName: family.village_name,
          currentAddress: family.current_address,
          dateOfBirth: family.date_of_birth,
          maritalStatus: family.marital_status,
          jobBusinessDetails: family.job_business_details,
          education: family.education,
          photoUrl: family.photo_url,
          paymentStatus: family.payment_status,
          receiptUrl: family.receipt_url,
          createdAt: family.created_at,
        },
        familyMembers: members.map(member => ({
          id: member.id,
          relationWithHead: member.relation_with_head,
          fullName: member.full_name,
          mobileNo: member.mobile_no,
          dateOfBirth: member.date_of_birth,
          maritalStatus: member.marital_status,
          jobBusinessDetails: member.job_business_details,
          education: member.education,
        })),
      },
    });
  } catch (error) {
    console.error('Get family details error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
