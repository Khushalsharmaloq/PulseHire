import mongoose from "mongoose";
import { SkillProof } from "../models/skillProof.model.js";
import { Application } from "../models/application.model.js";

import { getSkillFreshness } from "../utils/skillFreshness.util.js";


/* =====================================================
   ADD SKILL PROOF
===================================================== */

export const addSkillProof = async (req, res) => {
    try {
        const {
            skillName,
            proofType,
            proofUrl
        } = req.body;


        /* ==================== VALIDATION ==================== */

        if (!skillName || !proofType || !proofUrl) {
            return res.status(400).json({
                message: "Skill name, proof type and proof URL are required.",
                success: false
            });
        }


        const allowedProofTypes = [
            "certificate",
            "github",
            "project",
            "portfolio",
            "assessment"
        ];


        if (!allowedProofTypes.includes(proofType)) {
            return res.status(400).json({
                message: "Invalid proof type.",
                success: false
            });
        }


        /* ==================== CREATE PROOF ==================== */

        const skillProof = await SkillProof.create({
            candidate: req.userId,
            skillName: skillName.trim(),
            proofType,
            proofUrl: proofUrl.trim(),
            status: "pending",
            verificationRequestedAt: new Date()
        });


        return res.status(201).json({
            message: "Skill proof submitted for verification.",
            success: true,
            skillProof
        });

    } catch (error) {
        console.error(
            "Add skill proof error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};


/* =====================================================
   GET MY SKILL PROOFS
===================================================== */

export const getMySkillProofs = async (req, res) => {
    try {
        const skillProofs = await SkillProof.find({
            candidate: req.userId
        })
            .populate(
                "verifiedBy",
                "fullname email role"
            )
            .sort({
                createdAt: -1
            });


        const skillProofsWithFreshness =
            skillProofs.map((proof) => {
                return {
                    ...proof.toObject(),

                    freshness: getSkillFreshness(
                        proof.verifiedAt
                    )
                };
            });


        return res.status(200).json({
            success: true,
            skillProofs: skillProofsWithFreshness
        });

    } catch (error) {
        console.error(
            "Get skill proofs error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};


/* =====================================================
   GET SKILL PROOF
===================================================== */

export const getSkillProof = async (req, res) => {
    try {
        const {
            skillProofId
        } = req.params;


        /* ==================== VALIDATE ID ==================== */

        if (!mongoose.Types.ObjectId.isValid(skillProofId)) {
            return res.status(400).json({
                message: "Invalid skill proof ID.",
                success: false
            });
        }


        /* ==================== FIND SKILL PROOF ==================== */

        const skillProof = await SkillProof.findOne({
            _id: skillProofId,
            candidate: req.userId
        })
            .populate(
                "verifiedBy",
                "fullname email role"
            );


        if (!skillProof) {
            return res.status(404).json({
                message: "Skill proof not found.",
                success: false
            });
        }


        return res.status(200).json({
            success: true,

            skillProof: {
                ...skillProof.toObject(),

                freshness: getSkillFreshness(
                    skillProof.verifiedAt
                )
            }
        });

    } catch (error) {
        console.error(
            "Get skill proof error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};


/* =====================================================
   VERIFY SKILL PROOF
===================================================== */

export const verifySkillProof = async (req, res) => {
    try {
        const {
            skillProofId
        } = req.params;


        /* ==================== VALIDATE ID ==================== */

        if (!mongoose.Types.ObjectId.isValid(skillProofId)) {
            return res.status(400).json({
                message: "Invalid skill proof ID.",
                success: false
            });
        }


        /* ==================== FIND PROOF ==================== */

        const skillProof = await SkillProof.findById(
            skillProofId
        );


        if (!skillProof) {
            return res.status(404).json({
                message: "Skill proof not found.",
                success: false
            });
        }


        /* ==================== VERIFY RELATIONSHIP ==================== */

        const application = await Application.findOne({
            candidate: skillProof.candidate,
            recruiter: req.userId
        });


        if (!application) {
            return res.status(403).json({
                message: "You can only verify skill proofs for candidates who have applied to your jobs.",
                success: false
            });
        }


        /* ==================== VERIFY ==================== */

        const now = new Date();

        skillProof.status = "verified";

        skillProof.verifiedAt = now;

        skillProof.verifiedBy = req.userId;

        await skillProof.save();


        return res.status(200).json({
            message: "Skill proof verified successfully.",
            success: true,

            skillProof: {
                ...skillProof.toObject(),

                freshness: getSkillFreshness(
                    skillProof.verifiedAt
                )
            }
        });

    } catch (error) {
        console.error(
            "Verify skill proof error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};


/* =====================================================
   REQUEST RE-VERIFICATION
===================================================== */

export const requestReverification = async (req, res) => {
    try {
        const {
            skillProofId
        } = req.params;


        /* ==================== VALIDATE ID ==================== */

        if (!mongoose.Types.ObjectId.isValid(skillProofId)) {
            return res.status(400).json({
                message: "Invalid skill proof ID.",
                success: false
            });
        }


        const skillProof = await SkillProof.findOne({
            _id: skillProofId,
            candidate: req.userId
        });


        if (!skillProof) {
            return res.status(404).json({
                message: "Skill proof not found.",
                success: false
            });
        }


        if (skillProof.status !== "verified") {
            return res.status(400).json({
                message: "Only verified skill proofs can be re-verified.",
                success: false
            });
        }


        const now = new Date();


        skillProof.status = "pending";

        skillProof.lastReverificationRequestedAt = now;

        skillProof.verificationRequestedAt = now;

        skillProof.verifiedAt = null;

        skillProof.verifiedBy = null;


        await skillProof.save();


        return res.status(200).json({
            message: "Skill proof submitted for re-verification.",
            success: true,
            skillProof
        });

    } catch (error) {
        console.error(
            "Request re-verification error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};