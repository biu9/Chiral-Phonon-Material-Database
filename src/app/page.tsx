import SideBar from "@/components/SideBar";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import ElementTable from "@/components/ElementTable/index";

const SearchBar = () => {
    return (
        <div className="p-6 w-full flex justify-between space-x-12 items-end">
            <div className="grow-3">
                <div className="flex justify-between">
                    <div>Compound Contains</div>
                    <div className="flex items-center">
                        <div>Only these elements</div>
                        <Checkbox />
                    </div>
                </div>
                <TextField variant="outlined" size="small" fullWidth />
            </div>
            <div className="grow-2">
                <div className="flex justify-between">
                    Exclude
                </div>
                <TextField variant="outlined" size="small" fullWidth />
            </div>
            <div className="grow-2">
                <div className="flex justify-between">
                    Exclude
                </div>
                <TextField variant="outlined" size="small" fullWidth />
            </div>
            <div className="grow-2 bg-blue-600 text-white rounded-md">
                <Button variant="contained" fullWidth>Search</Button> 
            </div>
        </div>
    )
}

export default function Result() {
    return (
        <div className="flex">
            <SideBar />
            <div className="flex w-full flex-col">
                <SearchBar />
                <ElementTable />
            </div>
        </div>
    )
}