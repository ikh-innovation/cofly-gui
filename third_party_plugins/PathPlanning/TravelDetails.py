
class Calculate_Travel(object):
    # Python3 Program to calculate speed,
    # distance and time
    def __init__(self, dist, time, speed):
        self.dist = dist
        self.time = time
        self.speed = speed

    # Function to calculate speed
    def cal_speed(self):
        print(" Distance(meters) :", self.dist);
        print(" Time(min) :", self.time);
        return self.dist / self.time;

        # Function to calculate distance traveled

    def cal_dis(self):
        print(" Time(min) :", self.time);
        print(" Speed(m / s) :", self.speed);
        return self.speed * self.time;

        # Function to calculate time taken

    def cal_time(self):
        print(" Distance(meters) :", self.dist);
        print(" Speed(m / s) :", self.speed);
        print(" Time (min) :", (self.dist / self.speed) / 60);
        return (self.dist / self.speed) / 60; # divide time value by 60 for minutes
