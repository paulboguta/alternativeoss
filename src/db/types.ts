import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { alternatives, categories, projectCategories, projects } from './schema';

export type Project = InferSelectModel<typeof projects>;
export type NewProject = InferInsertModel<typeof projects>;

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

export type ProjectCategory = InferSelectModel<typeof projectCategories>;
export type NewProjectCategory = InferInsertModel<typeof projectCategories>;

export type Alternative = InferSelectModel<typeof alternatives>;
export type NewAlternative = InferInsertModel<typeof alternatives>;
