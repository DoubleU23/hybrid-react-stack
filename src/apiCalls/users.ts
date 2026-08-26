
// import type { UserValues } from 'src/components/admin/UserForm'
// import type { UserObject } from '../../convex/schema'

// export const apiFetchUsersPaginated = async () => {
//   const response = await fetch('https://dynamic-stingray-365.eu-west-1.convex.site/api/getUsersPaginated', {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
//  const responseJson = await response.json()
//   console.log(responseJson) // Outputs: "Success!"
//   return responseJson
// }

// // export const apiFetchUserByClerkId = async (clerkId: string) => {
// //   const targetUrl = new URL('https://dynamic-stingray-365.eu-west-1.convex.site/api/getUserByClerkId')
// //   // targetUrl.searchParams.append("id", clerkId);
// //   const response = await fetch(targetUrl, {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/json',
// //     },
// //     body: JSON.stringify({ id: clerkId }),
// //   })

// //   const data = await response.json()
// //   console.log('data :>> ', data)
// //   console.log(data)
// //   return data
// // }

// export async function apiPushUserUpdate(userData: Partial<UserValues>) {
//   const targetUrl = new URL('https://dynamic-stingray-365.eu-west-1.convex.site/api/pushUserUpdate')
//   const response = await fetch(targetUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ user: userData }),
//   })

//   const responseJson = await response.json()
//   console.log(responseJson)
//   return responseJson
// }

// // const INITIAL_EMPLOYEES_STORE: Partial<UserObject>[] = [
// //   {
// //     clerk_user_id: "",
// //     username: 'Edward Perry',
// //     created_at: Number(new Date('now')),
// //     role: 'user',
// //   },
// //   {
// //     clerk_user_id: "",
// //     username: 'Josephine Drake',
// //     created_at: Number(new Date('now')),
// //     role: 'user',
// //   },
// //   {
// //     clerk_user_id: "",
// //     username: 'Cody Phillips',
// //     created_at: Number(new Date('now')),
// //     role: 'user',
// //   },
// // ];

// // export async function getMany({
// //   paginationModel,
// //   filterModel,
// //   sortModel,
// // }: {
// //   paginationModel: GridPaginationModel;
// //   sortModel: GridSortModel;
// //   filterModel: GridFilterModel;
// // }):any { //Promise<{ items: UserObject[]; itemCount: number }> {
// // const employeesStore = INITIAL_EMPLOYEES_STORE

// // let filteredEmployees = [...employeesStore];

// // // Apply filters (example only)
// // if (filterModel?.items?.length) {
// //   filterModel.items.forEach(({ field, value, operator }) => {
// //     if (!field || value == null) {
// //       return;
// //     }

// //     filteredEmployees = filteredEmployees.filter((employee) => {
// //       const employeeValue = employee[field as keyof UserObject];

// //       switch (operator) {
// //         case 'contains':
// //           return String(employeeValue).toLowerCase().includes(String(value).toLowerCase());
// //         case 'equals':
// //           return employeeValue === value;
// //         case 'startsWith':
// //           return String(employeeValue).toLowerCase().startsWith(String(value).toLowerCase());
// //         case 'endsWith':
// //           return String(employeeValue).toLowerCase().endsWith(String(value).toLowerCase());
// //         case '>':
// //           return employeeValue > value;
// //         case '<':
// //           return employeeValue < value;
// //         default:
// //           return true;
// //       }
// //     });
// //   });
// // }

// // // Apply sorting
// // if (sortModel?.length) {
// //   filteredEmployees.sort((a, b) => {
// //     for (const { field, sort } of sortModel) {
// //       if (a[field as keyof UserObject] < b[field as keyof UserObject]) {
// //         return sort === 'asc' ? -1 : 1;
// //       }
// //       if (a[field as keyof UserObject] > b[field as keyof UserObject]) {
// //         return sort === 'asc' ? 1 : -1;
// //       }
// //     }
// //     return 0;
// //   });
// // }

// // Apply pagination
// // const start = paginationModel.page * paginationModel.pageSize;
// // const end = start + paginationModel.pageSize;
// // const paginatedEmployees = filteredEmployees.slice(start, end);

// // return {
// //   items: paginatedEmployees,
// //   itemCount: filteredEmployees.length,
// // };
// // }

// export async function getOne(employeeId: string) {
//   // const employeesStore = INITIAL_EMPLOYEES_STORE;
//   // const employeeToShow = employeesStore.find((employee) => employee.clerk_user_id === employeeId);
//   // if (!employeeToShow) {
//   //   throw new Error('Employee not found');
//   // }
//   // return employeeToShow;
// }

// export async function createOne(data: Omit<UserObject, 'id'>) {
//   // const employeesStore = getEmployeesStore();
//   // const newEmployee = {
//   //   id: employeesStore.reduce((max:any, user:UserObject) => Math.max(max, user.clerk_user_id), 0) + 1,
//   //   ...data,
//   // };
//   // setEmployeesStore([...employeesStore, newEmployee]);
//   // return newEmployee;
// }

// // export async function apiPushUserUpdate(employeeId: string, data: Partial<Omit<Employee, '_id'>>) {
// //   // const employeesStore = getEmployeesStore();

// //   // let updatedEmployee: Employee | null = null;

// //   // setEmployeesStore(
// //   //   employeesStore.map((employee) => {
// //   //     if (employee.id === employeeId) {
// //   //       updatedEmployee = { ...employee, ...data };
// //   //       return updatedEmployee;
// //   //     }
// //   //     return employee;
// //   //   }),
// //   // );

// //   // if (!updatedEmployee) {
// //   //   throw new Error('Employee not found');
// //   // }
// //   // return updatedEmployee;
// // }


// Validation follows the [Standard Schema](https://standardschema.dev/).
