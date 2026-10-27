import Content from './Content';
import Lesson from './Lesson';
import PasswordResetToken from './PasswordResetToken';
import Progress from './Progress';
import RateLimit from './RateLimit';
import TestResult from './TestResult';
import User from './User';
import VerificationToken from './VerificationToken';

export const models = [
  User,
  VerificationToken,
  PasswordResetToken,
  Progress,
  RateLimit,
  TestResult,
  Content,
  Lesson,
] as const;

export { Content, Lesson, PasswordResetToken, Progress, RateLimit, TestResult, User, VerificationToken };
