import * as Sentry from '@sentry/react-native'
import VersionNumber from 'react-native-version-number'
import { sentryDSN } from 'src/config'
import { routeList } from '../routeList'
import strings from '../locales/strings'
import ErrorCode from './errorCodes'
export { ErrorCode }

export class AppError extends Error {
  // private code: ErrorCode
  public origError: any
  navigateTo: routeList

  public constructor(
    code = ErrorCode.Unknown,
    origError?: any,
    navigateTo: routeList = routeList.AppInit,
  ) {
    super(strings[code] || strings[ErrorCode.Unknown])
    // this.code = code
    this.origError = origError
    this.navigateTo = navigateTo
  }
}

export const errorTitleMessages = [strings.DAMN, strings.OH_NO, strings.UH_OH]

export function initErrorReporting() {
  Sentry.init({
    dsn: sentryDSN,
    release: `${VersionNumber.bundleIdentifier}@${VersionNumber.appVersion}`,

    // disable automatic reporting of errors/rejections without user consent
    integrations: (defaultIntegrations: any[]) =>
      defaultIntegrations.filter(i => i.name !== 'ReactNativeErrorHandlers'),

    // remove user id
    // @TODO make this configurable from settings
    beforeSend: (event: any) => {
      if (event.user) delete event.user
      if (!event.extra.sendPrivateData) {
        delete event.contexts.device
        // delete event.contexts.os
        // delete event.contexts.app
      }
      delete event.extra.sendPrivateData
      return event
    },
  })
}

export interface UserReport {
  userError: string | undefined
  userDescription: string
  userContact: string
  sendPrivateData: boolean
}

interface ErrorReport extends UserReport {
  error: AppError | Error | undefined
}

export function reportError(report: ErrorReport) {
  Sentry.withScope(scope => {
    if (report.error instanceof AppError && report.error.origError) {
      scope.setExtras({
        AppError: report.error.message,
        UserError: report.userError,
        UserDescription: report.userDescription,
        UserContact: report.userContact,
        sendPrivateData: report.sendPrivateData,
      })
      report.error = report.error.origError
    }
    Sentry.captureException(report.error)
  })
}
