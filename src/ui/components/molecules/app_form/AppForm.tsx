import { Formik, FormikHandlers, FormikProps, FormikValues } from 'formik'
import React, { RefObject } from 'react'

export interface AppFormProps {
    children?: React.ReactNode
    initialValues: FormikValues
    onSubmit: (values: FormikValues) => void
    validateOnMount?: boolean
    validationSchema: FormikValues
    innerRef?: RefObject<FormikProps<FormikValues> & FormikHandlers>
}

type Props = AppFormProps

const AppForm: React.FC<Props> = ({
    initialValues,
    onSubmit,
    validationSchema,
    validateOnMount,
    children,
    innerRef,
}) => {
    /*  AppLog.logForcefullyForComplexMessages(
      () =>
    "AppForm => initialValues " + JSON.stringify(initialValues)
  );*/

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validateOnMount={validateOnMount}
            validationSchema={validationSchema}
            innerRef={innerRef}
        >
            {() => <>{children}</>}
        </Formik>
    )
}

export default AppForm
