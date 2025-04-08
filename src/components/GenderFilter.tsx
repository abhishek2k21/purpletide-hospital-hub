
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

export type Gender = 'all' | 'Male' | 'Female' | 'Other';

// Define a constant array for gender options with proper typing
export const genderOptions: readonly Gender[] = ['all', 'Male', 'Female', 'Other'] as const;

export interface GenderFilterProps {
  value: Gender;
  onChange: (value: Gender) => void;
  className?: string;
  showReset?: boolean;
  onReset?: () => void;
}

export const GenderFilter: React.FC<GenderFilterProps> = ({ 
  value, 
  onChange, 
  className = "",
  showReset = false,
  onReset
}) => {
  const handleValueChange = (newValue: string) => {
    onChange(newValue as Gender);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Gender</SelectLabel>
            {genderOptions.map((gender) => (
              <SelectItem key={gender} value={gender}>
                {gender === 'all' ? 'All Genders' : gender}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      
      {showReset && value !== 'all' && onReset && (
        <button 
          onClick={onReset}
          className="text-sm text-primary hover:underline"
          type="button"
        >
          Reset
        </button>
      )}
    </div>
  );
};
