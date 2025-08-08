import { defineDb, defineTable, column } from 'astro:db';

const Facilitators = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    createdDate: column.date(),
    updatedDate: column.date(),
    firstName: column.text(),
    lastName: column.text(),
    email: column.text(),
    languages: column.text({ optional: true }),
    country: column.text({ optional: true }),
    timeZone: column.text({ optional: true }),
    location: column.text({ optional: true }),
    website: column.text({ optional: true }),
    yearsOfExperience: column.text({ optional: true }),
    areasOfExpertise: column.json({ optional: true }),
    certifications: column.text({ optional: true }),
    fees: column.text({ optional: true }),
    programOffered: column.text({ optional: true }),
    clientList: column.text({ optional: true }),
    status: column.text({ optional: true })
  }
})

export default defineDb({
  tables: { Facilitators },
})