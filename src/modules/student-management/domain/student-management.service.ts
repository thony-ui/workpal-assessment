import prisma from "../../../config/db";

export const registerStudentsService = async (
  teacherEmail: string,
  studentEmails: string[]
) => {
  // Check if there is already a teacher with the given email
  let teacher = await prisma.teacher.findUnique({
    where: { email: teacherEmail },
  });

  if (!teacher) {
    teacher = await prisma.teacher.create({
      data: { email: teacherEmail },
    });
  }

  await Promise.all(
    studentEmails.map(async (email) => {
      // check if there is already a student with the given email
      let student = await prisma.student.findUnique({
        where: { email },
      });

      if (!student) {
        student = await prisma.student.create({
          data: { email },
        });
      }

      // check if there is already an existing relation between the teacher and student
      const existingRelation = await prisma.teacherStudent.findUnique({
        where: {
          teacherId_studentId: {
            teacherId: teacher.id,
            studentId: student.id,
          },
        },
      });

      if (!existingRelation) {
        await prisma.teacherStudent.create({
          data: {
            teacherId: teacher.id,
            studentId: student.id,
          },
        });
      }
    })
  );
};

export const getCommonStudentsService = async (
  teacherEmails: string[]
): Promise<string[]> => {
  // Get teacher records, and get the id
  const teachers = await prisma.teacher.findMany({
    where: {
      email: { in: teacherEmails },
    },
    select: {
      id: true,
    },
  });

  const teacherIds = teachers.map((t) => t.id);
  // this is to get students linked to any given teacher in the teacherEmails
  const students = await prisma.student.findMany({
    where: {
      teachers: {
        some: {
          teacherId: { in: teacherIds },
        },
      },
    },
    include: {
      teachers: true,
    },
  });

  // Filter students linked to ALL given teachers
  const common = students.filter((student) => {
    const linkedTeacherIds = student.teachers.map((rel) => rel.teacherId);
    return teacherIds.every((id) => linkedTeacherIds.includes(id));
  });

  return common.map((s) => s.email);
};

export const suspendStudentService = async (studentEmail: string) => {
  // This works because we already ensure that all students are unique
  await prisma.student.update({
    where: { email: studentEmail },
    data: { suspended: true },
  });
};

export const getNotificationRecipientsService = async (
  teacherEmail: string,
  notificationText: string
): Promise<string[]> => {
  // Get the teacher record and all the students linked to the teacher who are not suspended
  const teacher = await prisma.teacher.findUnique({
    where: { email: teacherEmail },
    include: {
      students: {
        where: { student: { suspended: false } },
        include: { student: true },
      },
    },
  });

  const registeredStudentEmails =
    teacher?.students.map((s) => s.student.email) || [];

  // this regex is used to extract the @mentioned emails from the notification text
  // we get the second match group which is the email
  const extractMentionedEmails = (text: string): string[] => {
    const regex = /@([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    return [...text.matchAll(regex)].map((match) => match[1]);
  };

  const mentionedEmails = extractMentionedEmails(notificationText);

  // get all the emails mentioned in the notification text that are not suspended
  const mentionedStudents = await prisma.student.findMany({
    where: {
      email: { in: mentionedEmails },
      suspended: false,
    },
  });

  const all = new Set([
    ...registeredStudentEmails,
    ...mentionedStudents.map((s) => s.email),
  ]);

  return [...all];
};
