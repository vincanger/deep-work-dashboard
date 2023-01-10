import HttpError from '@wasp/core/HttpError.js';

export const getWork = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  console.log('context.user', context.user);
  return context.entities.Work.findMany({
    where: {
      user: {
        userId: context.user.userId,
      },
    },
    orderBy: {
      id: 'asc',
    },
  });
};
