import React, { useEffect, useState } from 'react';
import { NextPageWithLayout } from "@/pages/page";

import Spinner from '@/components/ui/spinner';
import { Formik } from "formik";
import Input from '@/components/ui/input/Input';
import * as Yup from "yup";
import { FaChevronDown } from 'react-icons/fa6';
import { useMutation } from '@tanstack/react-query';
import Api from '@/apis/Api';

export type TTask =  {
  id?: number,
  task: string,
  isCompleted?: boolean,
  createdAt?: string,
  updatedAt?: string,
}

export type TStoreTask = {
  request: {
    id?: number,
    task: string,
  },
  response: TTask
}
export const apiCreateTask = (options = {}) => {
  return useMutation({
    mutationKey: ["createTask"],
    mutationFn: async (formData: TStoreTask['request']): Promise<TStoreTask['response']> => {
      const response: any = await Api.fetchData({
          url: "/tasks",
          method: "post",
          data: formData,
        }
      )
      return response.data
    },
    ...options
  });
};

export type TChangeStatusTasks = {
  request: {
    ids: number[],
    isCompleted: boolean
  },
  response: any
}
export const apiChangeStatusTasks = (options = {}) => {
  return useMutation({
    mutationKey: ["changStatusTasks"],
    mutationFn: async ({ ids, isCompleted }: TChangeStatusTasks['request']): Promise<TChangeStatusTasks['response']> => {
      const response: any = await Api.fetchData({
          url: `/tasks/change_status`,
          method: "post",
          data: {
            ids, isCompleted
          }
        }
      )
      return response.data
    },
    ...options
  });
};

export type TFilterTasks = {
  request: {
    isCompleted?: boolean
  },
  response: {
    records: TTask[],
    count: number
  }
}
export const apiFilterTasks =
  (options = {}) => useMutation({
    mutationKey: ["filterTasks"],
    mutationFn: async ({isCompleted}: TFilterTasks['request']): Promise<TFilterTasks['response']> => {
      const response: any = await Api.fetchData({
        url: `/tasks?isCompleted=${isCompleted}`
      });
      return response.data;
    },
    ...options
  });

type TTaskFormProp = {
  task?: TTask,
  onStoreTask: (values: TTask)=> void,
  toggleCompletedTask?: (id: number, isCompleted: boolean) => void
  toggleCompletedAllTasks?: (isCompleted: boolean) => void
}
const TaskForm = ({task, onStoreTask, toggleCompletedTask, toggleCompletedAllTasks}: TTaskFormProp) => {
  const onSubmit = (values: TStoreTask['request'], {resetForm}: any) => {
    onStoreTask({ id: task?.id, ...values })
    resetForm()
  }

  const toggleCompleted = (id: number, isCompleted: boolean) => {
    if(toggleCompletedTask && id) toggleCompletedTask(id, isCompleted)
  }

  const toggleCompletedAll = (isCompleted: boolean) => {
    if(toggleCompletedAllTasks) toggleCompletedAllTasks(isCompleted)
  }

  const validationSchema = Yup.object().shape({
    task: Yup.string().required("Required"),
  });

  return (
    <div className="flex flex-row items-center justify-between gap-3 mb-3 border-b pb-3">
      <div className="flex flex-1 flex-row gap-3 items-center">
        {task?.id ? (
          <input type='checkbox' checked={task.isCompleted} onChange={() => {
            if(task?.id) toggleCompleted(task.id, !task.isCompleted)
          }} />
        ): (
          <FaChevronDown onClick={() => toggleCompletedAll(true)}/>
        )}
        <Formik
          onSubmit={onSubmit}
          enableReinitialize
          initialValues={{
            task: task?.task || '',
          }}
          validationSchema={validationSchema}
        >
          {({ setFieldValue, handleSubmit }) => (
            <form onSubmit={e => e.preventDefault()} className='w-full'>
              <Input
                readOnly={!!task?.id}
                name='task'
                onKeyPress={(event)=>{
                  if(event.key.toLowerCase() === 'enter') {
                    handleSubmit();
                  }
                }}
                className={task?.isCompleted ? 'line-through' : ''}
              />
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};


const TodoPage: NextPageWithLayout = () => {
  const [filterStatus, setFilterStatus] = useState<boolean | undefined>();
  const mutate = apiFilterTasks();
  const mutation = apiCreateTask();
  const mutationChangeStatus = apiChangeStatusTasks();
  const onRefesh = () => mutate.mutate({ isCompleted: filterStatus });
  const onStoreTask = (values: TStoreTask['request']) => {
    mutation.mutate(values, {
      onSuccess: onRefesh,
    });
  };

  const toggleCompletedTask = (id: number, isCompleted: boolean) => {
    mutationChangeStatus.mutate({ids: [id], isCompleted},{
      onSuccess: onRefesh
    })
  }

  const toggleCompletedAllTasks = (isCompleted: boolean) => {
    mutationChangeStatus.mutate({ids: [0], isCompleted},{
      onSuccess: onRefesh
    })
  }

  const onFilter = (status?: boolean) => {
    setFilterStatus(status);
  };

  useEffect(() => {
    mutate.mutate({ isCompleted: filterStatus });
  }, [filterStatus]);

  return (
    <section className="py-6 text-sm">
      {mutate.error && <div className='text-red-500'>{mutate.error.response?.data?.message ?? mutate.error.message}</div>}
      <div className="flex flex-row justify-between items-center">
        <h1>Tasks</h1>
      </div>
      <div>
        <TaskForm
          onStoreTask={onStoreTask}
          toggleCompletedAllTasks={toggleCompletedAllTasks}
        />
        {mutate.isPending ? <Spinner /> :  (
          (mutate.data?.records || []).map(task=> (
            <TaskForm
              key={task.id}
              task={task}
              onStoreTask={onStoreTask}
              toggleCompletedTask={toggleCompletedTask}
              toggleCompletedAllTasks={toggleCompletedAllTasks}
            />
          ))
        )}
        <div className="flex flex-row items-center justify-between gap-6 mt-4">
          <div>
            {`${mutate.data?.records.length || '-'} / ${mutate.data?.count || '-'} items`}
          </div>
          <div className="flex flex-row items-center gap-4">
            <div
              className={`cursor-pointer underline ${filterStatus === undefined ? 'font-bold' : ''}`}
              onClick={() => onFilter()}
            >
              All
            </div>
            <div
              className={`cursor-pointer underline ${filterStatus === false ? 'font-bold' : ''}`}
              onClick={() => onFilter(false)}
            >
              InCompleted
            </div>
            <div
              className={`cursor-pointer underline ${filterStatus === true ? 'font-bold' : ''}`}
              onClick={() => onFilter(true)}
            >
              Completed
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TodoPage;
