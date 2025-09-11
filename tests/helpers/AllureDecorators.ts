import { allure } from "allure-playwright";
import { AllureBusinessConfig } from '../config/AllureBusinessConfig';

/**
 * Decorators para aplicar etiquetas de negocio de forma consistente
 */

// Epic Decorators
export const AuthenticationEpic = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    allure.epic(AllureBusinessConfig.EPICS.AUTHENTICATION);
    return originalMethod.apply(this, args);
  };
};

export const VendorManagementEpic = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    allure.epic(AllureBusinessConfig.EPICS.VENDOR_MANAGEMENT);
    return originalMethod.apply(this, args);
  };
};

export const SpecializedRolesEpic = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    allure.epic(AllureBusinessConfig.EPICS.SPECIALIZED_ROLES);
    return originalMethod.apply(this, args);
  };
};

// Feature Decorators
export const QRCouponsFeature = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    allure.feature(AllureBusinessConfig.FEATURES.COUPONS_QR);
    return originalMethod.apply(this, args);
  };
};

export const QRPaymentCouponsFeature = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    allure.feature(AllureBusinessConfig.FEATURES.COUPONS_QR_PAYMENT);
    return originalMethod.apply(this, args);
  };
};

export const DNICouponsFeature = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    allure.feature(AllureBusinessConfig.FEATURES.COUPONS_DNI);
    return originalMethod.apply(this, args);
  };
};

export const DNIPaymentCouponsFeature = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    allure.feature(AllureBusinessConfig.FEATURES.COUPONS_DNI_PAYMENT);
    return originalMethod.apply(this, args);
  };
};

export const VendorLimitationsFeature = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    allure.feature(AllureBusinessConfig.FEATURES.VENDOR_LIMITATIONS);
    return originalMethod.apply(this, args);
  };
};

export const SupervisorManagementFeature = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    allure.feature(AllureBusinessConfig.FEATURES.SUPERVISOR_MANAGEMENT);
    return originalMethod.apply(this, args);
  };
};

export const ValidatorManagementFeature = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    allure.feature(AllureBusinessConfig.FEATURES.VALIDATOR_MANAGEMENT);
    return originalMethod.apply(this, args);
  };
};

// Story Decorators
export const QRCreationStory = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    allure.story(AllureBusinessConfig.STORIES.QR_CREATION);
    return originalMethod.apply(this, args);
  };
};

export const LimitationAssignmentStory = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    allure.story(AllureBusinessConfig.STORIES.LIMITATION_ASSIGNMENT);
    return originalMethod.apply(this, args);
  };
};

export const LimitationRemovalStory = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    allure.story(AllureBusinessConfig.STORIES.LIMITATION_REMOVAL);
    return originalMethod.apply(this, args);
  };
};

// Utility function para aplicar múltiples etiquetas
export const BusinessContext = (epic: string, feature: string, story: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      allure.epic(epic);
      allure.feature(feature);
      allure.story(story);
      return originalMethod.apply(this, args);
    };
  };
};
