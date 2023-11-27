import { BaseSyntheticEvent, useState, useEffect } from "react";
import { ProjectModel } from "../models/ProjectModel";
import { FaMagnifyingGlass, FaCircleXmark } from "react-icons/fa6";

function Grid({
  projectList,
  showMultiSelect = false,
}: {
  projectList: ProjectModel[];
  showMultiSelect?: boolean;
}) {
  // let originalProjectList = [] as ProjectModel[];
  // let localProjectList = [] as ProjectModel[];
  // all data
  const [originalProjectList, setOriginalProjectList] = useState(
    [] as ProjectModel[]
  );

  // list shown to user
  const [localProjectList, setLocalProjectList] = useState(
    [] as ProjectModel[]
  );

  // selected from localProjectList
  const [selectedGridItems, setSelectedGridItems] = useState(
    [] as ProjectModel[]
  );

  const [isShowingFilter, setIsShowingFilter] = useState(false);

  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    if (projectList) {
      setSelectedGridItems([] as ProjectModel[]);
      setOriginalProjectList([...projectList]);
      setLocalProjectList([...projectList]);
      // originalProjectList = [...projectList];
      // localProjectList = [...originalProjectList];

      resetState();
    }
  }, [projectList]);

  useEffect(() => {
    const doFilter = setTimeout(() => {
      if (searchFilter == null || searchFilter.trim() === "") {
        setLocalProjectList([...originalProjectList]);
      } else {
        setLocalProjectList([
          ...originalProjectList.filter((el) =>
            el.project_name.toLowerCase().includes(searchFilter.toLowerCase())
          ),
        ]);
      }
    }, 1000);

    return () => clearTimeout(doFilter);
  }, [searchFilter]);

  const resetState = () => {
    setIsShowingFilter(false);
    setSearchFilter("");
  };

  const handleIsSelectedChange = (
    event: BaseSyntheticEvent,
    row_data: ProjectModel
  ) => {
    if (event.target.checked === true) {
      setSelectedGridItems((currVal: any) => [...currVal, row_data]);
    } else {
      setSelectedGridItems((currVal) =>
        currVal.filter((el) => el.project_id !== row_data.project_id)
      );
    }
  };

  const handleIsSelectedAllChange = (event: BaseSyntheticEvent) => {
    setSelectedGridItems([...([] as ProjectModel[])]);
    if (event.target.checked === true) {
      setSelectedGridItems([...localProjectList]);
    }
  };

  const getRowSelectedStatus = (row: ProjectModel) => {
    const data = selectedGridItems.find(
      (el) => el.project_id === row.project_id
    );
    return data != null;
  };

  const getIsCheckedAll = (): boolean => {
    return (
      localProjectList &&
      localProjectList.length > 0 &&
      localProjectList.length === selectedGridItems.length
    );
  };

  const onHeaderClick = (): void => {
    setIsShowingFilter((prevVal) => !prevVal);
  };

  const onSearchFilterKeyUp = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchFilter(e.target?.value ?? "");
  };

  return (
    <div className="overflow-x-auto overflow-y-auto min-h-full max-h-full">
      <table className="table table-pin-rows">
        <thead>
          <tr className="bg-indigo-600">
            {showMultiSelect && (
              <th>
                <div>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-accent"
                    checked={getIsCheckedAll()}
                    onChange={(e) => handleIsSelectedAllChange(e)}
                  />
                </div>
              </th>
            )}
            <th className="text-lg text-primary-content">
              <div className="flex flex-col">
                <div className="flex flex-row items-center">
                  <span className="mr-2">Project Name</span>{" "}
                  <button onClick={onHeaderClick}>
                    {isShowingFilter === true ? (
                      <FaCircleXmark />
                    ) : (
                      <FaMagnifyingGlass />
                    )}
                  </button>
                </div>
                {isShowingFilter === true && (
                  <h1 className="flex-1">
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Insert search filter</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Search filter"
                        className="input input-bordered w-full"
                        value={searchFilter}
                        onChange={(e) => onSearchFilterKeyUp(e)}
                      />
                    </div>
                  </h1>
                )}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {localProjectList?.map((row) => {
            const isRowSelected = getRowSelectedStatus(row);
            return (
              <tr key={row.project_id} className="hover">
                {showMultiSelect && (
                  <td className="object-center">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-accent"
                      checked={isRowSelected}
                      onChange={(e) => {
                        handleIsSelectedChange(e, row);
                      }}
                    />
                  </td>
                )}
                <td>{row.project_name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Grid;
