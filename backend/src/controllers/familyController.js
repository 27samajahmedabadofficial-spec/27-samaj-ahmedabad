import pool from "../config/database.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../../public/uploads/families");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const registerFamily = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const {
      fullName,
      mobileNo,
      villageName,
      currentAddress,
      dateOfBirth,
      maritalStatus,
      jobBusinessDetails,
      education,
      familyMembers,
      paymentStatus,
    } = req.body;

    // Validate required fields
    if (!fullName || !mobileNo) {
      return res.status(400).json({ error: "Full name and mobile number are required" });
    }

    // Parse familyMembers if it's a JSON string
    let parsedFamilyMembers = [];
    if (familyMembers) {
      try {
        parsedFamilyMembers = typeof familyMembers === 'string' 
          ? JSON.parse(familyMembers) 
          : familyMembers;
        console.log("Parsed family members:", parsedFamilyMembers);
      } catch (error) {
        console.error("Error parsing familyMembers:", error);
        parsedFamilyMembers = [];
      }
    }

    // Handle photo upload
    let photoUrl = null;
    if (req.files?.photo) {
      const photoFile = req.files.photo;
      const photoFilename = `${userId}_${Date.now()}_${photoFile.name}`;
      const photoPath = path.join(uploadsDir, photoFilename);
      
      await photoFile.mv(photoPath);
      photoUrl = `/uploads/families/${photoFilename}`;
    }

    // Handle receipt upload
    let receiptUrl = null;
    if (req.files?.receipt) {
      const receiptFile = req.files.receipt;
      const receiptFilename = `${userId}_receipt_${Date.now()}_${receiptFile.name}`;
      const receiptPath = path.join(uploadsDir, receiptFilename);
      
      await receiptFile.mv(receiptPath);
      receiptUrl = `/uploads/families/${receiptFilename}`;
    }

    // Insert family head details
    const [familyResult] = await connection.execute(
      `INSERT INTO families 
       (user_id, full_name, mobile_no, village_name, current_address, date_of_birth, 
        marital_status, job_business_details, education, photo_url, payment_status, receipt_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        fullName,
        mobileNo,
        villageName,
        currentAddress,
        dateOfBirth,
        maritalStatus,
        jobBusinessDetails,
        education,
        photoUrl,
        paymentStatus === "completed" ? "completed" : "pending",
        receiptUrl,
      ]
    );

    const familyId = familyResult.insertId;

    // Insert family members
    if (Array.isArray(parsedFamilyMembers) && parsedFamilyMembers.length > 0) {
      console.log(`Inserting ${parsedFamilyMembers.length} family members for family ${familyId}`);
      
      for (const member of parsedFamilyMembers) {
        // Only insert if member has a name and relation
        if (member.fullName && member.relation) {
          try {
            console.log(`Inserting member: ${member.fullName} (${member.relation})`);
            await connection.execute(
              `INSERT INTO family_members 
               (family_id, relation_with_head, full_name, mobile_no, date_of_birth, 
                marital_status, job_business_details, education)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                familyId,
                member.relation,
                member.fullName,
                member.mobileNo || null,
                member.dateOfBirth || null,
                member.maritalStatus || null,
                member.jobBusinessDetails || null,
                member.education || null,
              ]
            );
            console.log(`Successfully inserted: ${member.fullName}`);
          } catch (error) {
            console.error(`Error inserting family member ${member.fullName}:`, error);
            // Continue with next member instead of failing
          }
        } else {
          console.warn(`Skipping member - missing fullName or relation:`, member);
        }
      }
    } else {
      console.log("No family members to insert or invalid format");
    }

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "Family registration completed successfully!",
      familyId,
      paymentUrl: paymentStatus === "pending" ? `/api/payment/initiate/${familyId}` : null,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Family registration error:", error);
    return res.status(500).json({ error: error.message || "Failed to register family" });
  } finally {
    connection.release();
  }
};

export const getFamilyDetails = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const [families] = await pool.execute(
      `SELECT * FROM families WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    if (families.length === 0) {
      return res.status(404).json({ error: "No family registration found" });
    }

    const family = families[0];

    const [members] = await pool.execute(
      `SELECT * FROM family_members WHERE family_id = ? ORDER BY created_at ASC`,
      [family.id]
    );

    return res.json({
      success: true,
      family,
      members,
    });
  } catch (error) {
    console.error("Get family details error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch family details" });
  }
};

export const updateFamilyStatus = async (req, res) => {
  try {
    const { familyId } = req.params;
    const { paymentStatus, receiptUrl } = req.body;

    const [result] = await pool.execute(
      `UPDATE families SET payment_status = ?, receipt_url = ? WHERE id = ?`,
      [paymentStatus, receiptUrl, familyId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Family not found" });
    }

    return res.json({
      success: true,
      message: "Family status updated successfully",
    });
  } catch (error) {
    console.error("Update family status error:", error);
    return res.status(500).json({ error: error.message || "Failed to update family status" });
  }
};

export const updateFamilyDetails = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const {
      fullName,
      mobileNo,
      villageName,
      currentAddress,
      dateOfBirth,
      maritalStatus,
      jobBusinessDetails,
      education,
      paymentStatus,
    } = req.body;

    // Get existing family
    const [families] = await pool.execute(
      `SELECT * FROM families WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    if (families.length === 0) {
      return res.status(404).json({ error: "No family registration found" });
    }

    const familyId = families[0].id;
    let photoUrl = families[0].photo_url;
    let receiptUrl = families[0].receipt_url;

    // Handle photo upload
    if (req.files?.photo) {
      const photoFile = req.files.photo;
      const photoFilename = `${userId}_${Date.now()}_${photoFile.name}`;
      const photoPath = path.join(uploadsDir, photoFilename);
      
      await photoFile.mv(photoPath);
      photoUrl = `/uploads/families/${photoFilename}`;
    }

    // Handle receipt upload
    if (req.files?.receipt) {
      const receiptFile = req.files.receipt;
      const receiptFilename = `${userId}_receipt_${Date.now()}_${receiptFile.name}`;
      const receiptPath = path.join(uploadsDir, receiptFilename);
      
      await receiptFile.mv(receiptPath);
      receiptUrl = `/uploads/families/${receiptFilename}`;
    }

    // Update family details
    await pool.execute(
      `UPDATE families 
       SET full_name = ?, mobile_no = ?, village_name = ?, current_address = ?, 
           date_of_birth = ?, marital_status = ?, job_business_details = ?, 
           education = ?, photo_url = ?, receipt_url = ?, payment_status = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        fullName,
        mobileNo,
        villageName,
        currentAddress,
        dateOfBirth,
        maritalStatus,
        jobBusinessDetails,
        education,
        photoUrl,
        receiptUrl,
        paymentStatus || families[0].payment_status,
        familyId,
      ]
    );

    return res.json({
      success: true,
      message: "Family details updated successfully",
      familyId,
    });
  } catch (error) {
    console.error("Update family details error:", error);
    return res.status(500).json({ error: error.message || "Failed to update family details" });
  }
};

export const addFamilyMember = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const {
      relation,
      fullName,
      mobileNo,
      dateOfBirth,
      maritalStatus,
      jobBusinessDetails,
      education,
    } = req.body;

    // Validate required fields
    if (!relation || !fullName) {
      return res.status(400).json({ error: "Relation and full name are required" });
    }

    // Get user's family
    const [families] = await pool.execute(
      `SELECT id FROM families WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    if (families.length === 0) {
      return res.status(404).json({ error: "No family registration found" });
    }

    const familyId = families[0].id;

    // Insert new family member
    const [result] = await pool.execute(
      `INSERT INTO family_members 
       (family_id, relation_with_head, full_name, mobile_no, date_of_birth, 
        marital_status, job_business_details, education)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        familyId,
        relation,
        fullName,
        mobileNo || null,
        dateOfBirth || null,
        maritalStatus || null,
        jobBusinessDetails || null,
        education || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Family member added successfully",
      memberId: result.insertId,
    });
  } catch (error) {
    console.error("Add family member error:", error);
    return res.status(500).json({ error: error.message || "Failed to add family member" });
  }
};

export const updateFamilyMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const {
      relation,
      fullName,
      mobileNo,
      dateOfBirth,
      maritalStatus,
      jobBusinessDetails,
      education,
    } = req.body;

    // Validate required fields
    if (!relation || !fullName) {
      return res.status(400).json({ error: "Relation and full name are required" });
    }

    // Update family member
    const [result] = await pool.execute(
      `UPDATE family_members 
       SET relation_with_head = ?, full_name = ?, mobile_no = ?, date_of_birth = ?, 
           marital_status = ?, job_business_details = ?, education = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        relation,
        fullName,
        mobileNo || null,
        dateOfBirth || null,
        maritalStatus || null,
        jobBusinessDetails || null,
        education || null,
        memberId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Family member not found" });
    }

    return res.json({
      success: true,
      message: "Family member updated successfully",
    });
  } catch (error) {
    console.error("Update family member error:", error);
    return res.status(500).json({ error: error.message || "Failed to update family member" });
  }
};

export const deleteFamilyMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    const [result] = await pool.execute(
      `DELETE FROM family_members WHERE id = ?`,
      [memberId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Family member not found" });
    }

    return res.json({
      success: true,
      message: "Family member deleted successfully",
    });
  } catch (error) {
    console.error("Delete family member error:", error);
    return res.status(500).json({ error: error.message || "Failed to delete family member" });
  }
};
