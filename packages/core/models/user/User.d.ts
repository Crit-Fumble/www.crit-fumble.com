/**
 * Implementation for User-related functions and utilities
 */
export interface User {
    id: string;
    email: string | null;
    name?: string;
}
/**
 * Type guard to check if an object is a valid User
 */
export declare function isUser(obj: any): obj is User;
/**
 * Type guard to check if an object is a valid partial User
 */
export declare function isPartialUser(obj: any): obj is Partial<User>;
//# sourceMappingURL=User.d.ts.map