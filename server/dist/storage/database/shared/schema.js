"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.skinAnalysisHistory = exports.healthCheck = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.healthCheck = (0, pg_core_1.pgTable)("health_check", {
    id: (0, pg_core_1.serial)().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});
exports.skinAnalysisHistory = (0, pg_core_1.pgTable)("skin_analysis_history", {
    id: (0, pg_core_1.serial)().notNull(),
    userId: (0, pg_core_1.integer)("user_id").notNull(),
    skinType: (0, pg_core_1.text)("skin_type").notNull(),
    concerns: (0, pg_core_1.jsonb)("concerns").notNull().default((0, drizzle_orm_1.sql) `'[]'::jsonb`),
    moisture: (0, pg_core_1.integer)("moisture").notNull(),
    oiliness: (0, pg_core_1.integer)("oiliness").notNull(),
    sensitivity: (0, pg_core_1.integer)("sensitivity").notNull(),
    acne: (0, pg_core_1.integer)("acne").notNull().default(0),
    wrinkles: (0, pg_core_1.integer)("wrinkles").notNull().default(0),
    spots: (0, pg_core_1.integer)("spots").notNull().default(0),
    pores: (0, pg_core_1.integer)("pores").notNull().default(0),
    blackheads: (0, pg_core_1.integer)("blackheads").notNull().default(0),
    recommendations: (0, pg_core_1.jsonb)("recommendations").notNull().default((0, drizzle_orm_1.sql) `'[]'::jsonb`),
    imageUrl: (0, pg_core_1.text)("image_url"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)().notNull(),
    openid: (0, pg_core_1.text)("openid"),
    phoneNumber: (0, pg_core_1.text)("phone_number").unique(),
    nickname: (0, pg_core_1.text)("nickname"),
    avatarUrl: (0, pg_core_1.text)("avatar_url"),
    detectionCount: (0, pg_core_1.integer)("detection_count").notNull().default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});
//# sourceMappingURL=schema.js.map