import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import type { OpenPosition } from '../utils/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cx } from '../utils/cx'

const MAX_FILE_SIZE = 10000000
const ACCEPTED_FILE_TYPES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/pdf',
]

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email(),
  motivation: z.string(),
  documents: z
    .any()
    .refine((files) => files?.length >= 1, 'Document is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      '.docx and pdf files are accepted.'
    ),
})

export default function SlideOver({ position }: { position: OpenPosition }) {
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
  })
  console.log(errors)

  const files = watch('documents')
  console.log(files)

  return (
    <>
      <button className="btn" onClick={() => setOpen(true)}>
        Apply Now
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setOpen}>
          <div className="absolute inset-0 overflow-hidden">
            <Dialog.Overlay className="absolute inset-0" />
            <div className="pointer-events-none fixed inset-0 left-0 flex max-w-full pr-10 sm:pr-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <div className="pointer-events-auto w-screen max-w-xl">
                  <form
                    onSubmit={handleSubmit(
                      ({ documents, ...data }) => {
                        console.log({ data })
                        const formData = new FormData()
                        data['open_position'] = position.id
                        for (let i = 0; i < documents.length; i++) {
                          formData.append(`files.documents`, documents[i], documents[i].name)
                        }
                        formData.append('data', JSON.stringify(data))

                        fetch('/api/form', {
                          method: 'POST',
                          body: formData,
                        })
                          .then((res) => res.json())
                          .then((res) => {
                            console.log(res)
                            setOpen(false)
                          })
                      }

                      // const dat = fetch('/api/form', {
                      //   method: 'POST',
                      //   headers: {
                      //     'Content-Type': 'form-data',
                      //   },
                      //   body: new FormData(data),
                      // })
                      //   .then((res) => res.json())
                      //   .then((res) => console.log(res))
                      // return dat
                      // }
                    )}
                    className="flex h-full flex-col space-y-8 divide-y divide-gray-200 overflow-y-scroll bg-white p-8 shadow-xl"
                  >
                    <div className="space-y-8 divide-y divide-gray-200">
                      <div>
                        <div>
                          <h3 className="text-xl font-bold leading-6 text-gray-900">
                            {position.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500"></p>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-4">
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Name
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                type="text"
                                id="name"
                                autoComplete="name"
                                required
                                className={`block w-full min-w-0 flex-1 rounded-md border-gray-300  sm:text-sm ${
                                  errors.name?.message
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'focus:border-orange-500 focus:ring-orange-500'
                                }`}
                                {...register('name')}
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-4">
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-700 required:text-red-500"
                            >
                              Email address
                            </label>
                            <div className="mt-1">
                              <input
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                {...register('email')}
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-6">
                            <label
                              htmlFor="motivation"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Motivation
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="motivation"
                                required
                                rows={3}
                                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                defaultValue={''}
                                {...register('motivation')}
                              />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                              Write a few sentences about yourself.
                            </p>
                          </div>
                          <div className="sm:col-span-6">
                            <label
                              htmlFor="documents"
                              className="block text-sm font-medium text-gray-700"
                            >
                              DOCUMENTS
                            </label>
                            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                              <div className="space-y-1 text-center">
                                <svg
                                  className="mx-auto h-12 w-12 text-gray-400"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 48 48"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                  <label
                                    htmlFor="documents"
                                    className="relative cursor-pointer rounded-md bg-white font-medium text-orange-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2 hover:text-orange-500"
                                  >
                                    <span>Upload a file</span>
                                    <input
                                      {...register('documents')}
                                      accept={ACCEPTED_FILE_TYPES.join(', ')}
                                      id="documents"
                                      type="file"
                                      className="sr-only"
                                      multiple
                                    />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">.docx, PDF, up to 10MB</p>
                              </div>
                            </div>
                            {errors.documents?.message && (
                              <p className="text-xs text-red-500">{errors.documents?.message}</p>
                            )}
                            {JSON.stringify(files)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-5">
                      <div className="flex justify-end">
                        <button
                          onClick={() => setOpen(false)}
                          type="button"
                          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-bold text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
