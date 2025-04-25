export const transformDataInput = (data: string | null | undefined) => {
     const res =
          data !== undefined
               ? data === '' || data?.trim() === '' || data === null
                    ? null
                    : data
               : null

     return res
}
